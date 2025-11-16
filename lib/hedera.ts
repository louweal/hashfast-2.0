import { Client, AccountId, Hbar, TransferTransaction, TransactionId, TokenId } from '@hashgraph/sdk';
import type { SessionTypes } from '@walletconnect/types';
import type { Link } from '@prisma/client';
import { useRuntimeConfig } from 'nuxt/app';
import { ref } from 'vue';
import type { Ref } from 'vue';

import { LedgerId } from '@hashgraph/sdk';
import {
    HederaSessionEvent,
    HederaJsonRpcMethod,
    DAppConnector,
    HederaChainId,
    DAppSigner,
} from '@hashgraph/hedera-wallet-connect';

interface Transfer {
    account: string;
    amount: number;
}

interface TransactionRecord {
    result: string;
    transfers: Transfer[];
    memo: number;
}

interface TransactionData {
    amount: number;
    currency: string;
    memo: string;
    timestamp: string;
}

interface MirrorNodeResponse {
    transactions: TransactionRecord[];
}

export interface Transaction {
    id: string;
    type: 'transfer' | 'mint' | 'burn' | 'mission' | 'donation';
    amount: number;
    from: string;
    to: string;
    timestamp: string;
    status: 'pending' | 'success' | 'failed';
    memo?: string;
}

export interface WalletState {
    isConnected: boolean;
    accountId: string | null;
    balance: {
        hbar: number;
        usdc: number;
    };
    transactions: Transaction[];
    signer?: DAppSigner;
}

export class HederaService {
    private client: Client;
    private network: string;
    private networkUrl: string;
    private usdcTokenId: string;
    private feeAccount: string;

    private USD_FEE: number;

    // private hashconnect: HashConnect;
    private dAppConnector: DAppConnector;
    // private sessionTopic: string | null = null;
    private state: WalletState;

    // public state: Ref<HashConnectConnectionState> = ref(HashConnectConnectionState.Disconnected);
    // public pairingData?: SessionData | null;

    constructor() {
        const config = useRuntimeConfig();

        this.USD_FEE = 0.01;

        this.state = {
            isConnected: false,
            accountId: null,
            balance: { hbar: 0, usdc: 0 },
            transactions: [],
        };

        // Initialize client based on network
        if (config.public.hederaNetwork === 'mainnet') {
            const appMetadata = {
                name: 'HashFast',
                description: '',
                icons: ['https://www.hashfast.app/app-icon.svg'],
                url: 'https://www.hashfast.app',
            };

            this.client = Client.forMainnet();
            this.network = 'mainnet';
            this.networkUrl = 'https://mainnet.mirrornode.hedera.com';
            this.usdcTokenId = '0.0.456858';
            this.feeAccount = '0.0.6774573';

            this.dAppConnector = new DAppConnector(
                appMetadata,
                LedgerId.MAINNET,
                'b8b1efb6a5dc745fcde127bf04d22506',
                Object.values(HederaJsonRpcMethod),
                [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
                [HederaChainId.Mainnet, HederaChainId.Testnet],
            );
        } else {
            // Testnet
            const appMetadata = {
                name: 'HashFast',
                description: '',
                icons: ['https://www.hashfast.app/app-icon.svg'],
                url: 'http://localhost:3000', // todo
            };

            this.client = Client.forTestnet();
            this.network = 'testnet';
            this.networkUrl = 'https://testnet.mirrornode.hedera.com';
            this.usdcTokenId = '0.0.429274';
            this.feeAccount = '0.0.1234567';
            this.dAppConnector = new DAppConnector(
                appMetadata,
                LedgerId.TESTNET,
                'b8b1efb6a5dc745fcde127bf04d22506',
                Object.values(HederaJsonRpcMethod),
                [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
                [HederaChainId.Mainnet, HederaChainId.Testnet],
            );
        }

        this.dAppConnector.onSessionIframeCreated = (session) => {
            this.handleNewSession(session);
        };
    }

    handleNewSession(session: SessionTypes.Struct) {
        const sessionAccount = session.namespaces?.hedera?.accounts?.[0];
        const sessionParts = sessionAccount?.split(':');
        const accountId = sessionParts.pop();
        const network = sessionParts.pop() || 'testnet';

        if (!accountId) {
            console.log('No accountId found in session');
            return;
        } else {
            // Save the accountId and network in local storage for later use
            localStorage.setItem('hederaAccountId', accountId);
            localStorage.setItem('hederaNetwork', network);
            console.log('sessionAccount is', accountId, network);
        }
    }

    async initDAppConnector() {
        try {
            await this.dAppConnector.init({ logger: 'error' });

            console.log('DAppConnector initialized');
        } catch (error) {
            console.error('Error initializing DAppConnector:', error);
            throw error;
        }
    }
    async openModal(): Promise<WalletState> {
        if (!this.dAppConnector) {
            throw new Error('DAppConnector not available');
        }

        try {
            console.log('🔗 Opening WalletConnect modal...');
            console.log('📱 Make sure you have HashPack or Blade wallet installed');
            console.log("🌐 If using browser extension, ensure it's enabled");

            // Open the WalletConnect modal
            const session = await this.dAppConnector.openModal();
            // Once connected, handle and store the session information
            this.handleNewSession(session);

            return this.state;
        } catch (error) {
            console.error('❌ Error connecting wallet:', error);

            // Provide helpful error messages
            if (error instanceof Error && error.message?.includes('scheme')) {
                console.error('💡 Solution: Install HashPack or Blade wallet extension');
                console.error('🔗 HashPack: https://hashpack.app/');
                console.error('🔗 Blade: https://blade.xyz/');
            }

            throw error;
        }
    }

    // Get signer for the connected account
    getSigner(): DAppSigner | null {
        return this.state.signer || null;
    }

    async sendPayment(link: Link, pro: boolean = false) {
        if (pro === true) {
            console.log('send pro payment');
        } else {
            console.log('send normal payment');
        }

        if (!link.accountId) {
            throw new Error('Link does not have an accountId');
        }
        if (!link.amount) {
            throw new Error('Link does not have an amount');
        }
        if (!link.currency) {
            throw new Error('Link does not have a currency');
        }

        await this.initDAppConnector();
        await this.openModal();

        const hederaAccountId = localStorage.getItem('hederaAccountId');
        console.log('hederaAccountId :>> ', hederaAccountId);

        while (!hederaAccountId) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('waiting for connection...');
        }

        const toAccount = link.accountId as string;
        const fromAccount = hederaAccountId as string;
        // get accountId from localstorage
        const signer = this.dAppConnector.signers.find(
            (signer_) => signer_.getAccountId().toString() === hederaAccountId,
        );

        console.log(signer);

        if (!signer) {
            throw new Error('Signer not found');
        }

        let transaction;

        if (link.currency == 'hbar') {
            const hbarPrice = await this.hbarPrice();
            const HBAR_FEE = this.USD_FEE / hbarPrice;
            const TINYBAR_FEE = Math.floor(HBAR_FEE * 100_000_000);

            let tinybarAmount = Number(link.amount) * 100_000_000;

            if (pro) {
                // Pro
                transaction = new TransferTransaction()
                    .addHbarTransfer(fromAccount, Hbar.fromTinybars(-1 * tinybarAmount)) //Sending account
                    .addHbarTransfer(toAccount, Hbar.fromTinybars(tinybarAmount - TINYBAR_FEE)) //Receiving account
                    .addHbarTransfer(this.feeAccount, Hbar.fromTinybars(TINYBAR_FEE)); // Fee
            } else {
                transaction = new TransferTransaction()
                    .addHbarTransfer(fromAccount, Hbar.fromTinybars(-1 * tinybarAmount)) //Sending account
                    .addHbarTransfer(toAccount, Hbar.fromTinybars(tinybarAmount)); //Receiving account
            }
        } else if (link.currency == 'usdc') {
            const scaledAmount = +link.amount * 1e6;
            let usdcAmount = Number(scaledAmount);
            const SCALED_USDC_FEE = this.USD_FEE * 1e6;
            if (pro) {
                transaction = new TransferTransaction()
                    .addTokenTransfer(TokenId.fromString(this.usdcTokenId), fromAccount, -usdcAmount) //Sending account
                    .addTokenTransfer(TokenId.fromString(this.usdcTokenId), toAccount, usdcAmount - SCALED_USDC_FEE) //Receiving account
                    .addTokenTransfer(TokenId.fromString(this.usdcTokenId), this.feeAccount, SCALED_USDC_FEE); // Fee
            } else {
                transaction = new TransferTransaction()
                    .addTokenTransfer(TokenId.fromString(this.usdcTokenId), fromAccount, -usdcAmount) //Sending account
                    .addTokenTransfer(TokenId.fromString(this.usdcTokenId), toAccount, usdcAmount); //Receiving account
            }
        } else {
            return { transactionId: null, receipt: null };
        }

        if (link.memo) {
            transaction = transaction.setTransactionMemo(link.memo);
        }

        transaction = transaction.setNodeAccountIds([
            new AccountId(3),
            new AccountId(4),
            new AccountId(6),
            new AccountId(7),
        ]);

        const signedTx = await transaction.freezeWithSigner(signer as any);
        const executedTx = await signedTx.executeWithSigner(signer as any);
        const transactionId = executedTx.transactionId.toString();
        const receipt = await executedTx.getReceiptWithSigner(signer as any);
        return { transactionId, receipt };
    }

    async executeTransaction(transaction: TransferTransaction) {
        // if (!this.pairingData) return;

        // const fromAccount = AccountId.fromString(this.state.accountId as string);
        const signer = this.state.signer;

        try {
            const response = await transaction.executeWithSigner(signer as any);
            const transactionId = response.transactionId.toString();
            const receipt = await response.getReceiptWithSigner(signer as any);
            return { transactionId, receipt };
        } catch (e) {
            console.log(e);

            return { transactionId: null, receipt: null };
        }
    }

    parseTransactionId(transactionId: string): string {
        const [accountId, timestampPart] = transactionId.split('@');

        if (!accountId || !timestampPart) {
            throw new Error('Invalid Hedera transaction ID');
        }

        // replace the dot between seconds and nanos with a dash
        const timestamp = timestampPart.replace('.', '-');
        return `${accountId}-${timestamp}`;
    }

    async getAllTransactionData(transactionId: string): Promise<any> {
        let txId = this.parseTransactionId(transactionId);
        const url = `${this.networkUrl}/api/v1/transactions/${txId}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Mirror node fetch failed: ${res.status}`);
        }

        const data: MirrorNodeResponse = await res.json();
        return data.transactions[0];
    }

    async getTransactionData(transactionId: string, receiverId: string, currency: string): Promise<TransactionData> {
        let paymentData = await this.getAllTransactionData(transactionId);

        let amount = 0;

        let memo = atob(paymentData['memo_base64']);
        let timestamp = paymentData['consensus_timestamp'];
        let transfers = paymentData['transfers'];
        let tokenTransfers = paymentData['token_transfers'];

        if (currency == 'usdc' && tokenTransfers.length > 0) {
            // currency = "USDC";
            for (let i = 0; i < tokenTransfers.length; i++) {
                // find the relevant token transfer
                if (tokenTransfers[i]['token_id'] == this.usdcTokenId && tokenTransfers[i]['account'] == receiverId) {
                    amount = tokenTransfers[i]['amount'] / 1e6;
                    break;
                }
            }
        } else if (currency == 'hbar' && transfers.length > 0) {
            // currency = "HBAR";
            for (let i = 0; i < transfers.length; i++) {
                // find the relevant token transfer
                if (transfers[i]['account'] == receiverId) {
                    amount = Number(transfers[i]['amount']) / 100_000_000;
                    break;
                }
            }
        }

        return { amount, currency, memo, timestamp };
    }

    async getTotalHBARTransactionAmount(paymentIds: string[], receiverId: string): Promise<number> {
        let amount = 0;

        for (let i = 0; i < paymentIds.length; i++) {
            amount += (await this.getTransactionData(paymentIds[i], receiverId, 'hbar')).amount;
        }

        return parseFloat(amount.toFixed(2));
    }

    async getTotalUSDCTransactionAmount(paymentIds: string[], receiverId: string): Promise<number> {
        let amount = 0;

        for (let i = 0; i < paymentIds.length; i++) {
            amount += (await this.getTransactionData(paymentIds[i], receiverId, 'usdc')).amount;
        }

        return parseFloat(amount.toFixed(2));
    }

    async hbarPrice() {
        // get HBAR price in USD from CoinGecko
        const resp = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd',
        );
        if (!resp.ok) {
            throw new Error('Failed to fetch price: ' + resp.statusText);
        }
        const data = await resp.json();
        const hbarPriceUsd = data['hedera-hashgraph'].usd;
        if (hbarPriceUsd == null) {
            throw new Error('HBAR price field missing');
        }

        const hbarPriceUsdc = hbarPriceUsd;

        return hbarPriceUsdc;
    }
}
