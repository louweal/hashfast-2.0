import { Client, AccountId, Hbar, TransferTransaction, TokenId } from '@hashgraph/sdk';
import type { SessionTypes } from '@walletconnect/types';
import type { Link } from '@prisma/client';
import { useRuntimeConfig } from 'nuxt/app';

import { LedgerId } from '@hashgraph/sdk';
import {
    HederaSessionEvent,
    HederaJsonRpcMethod,
    DAppConnector,
    HederaChainId,
    DAppSigner,
} from '@hashgraph/hedera-wallet-connect';
import { th } from 'zod/v4/locales';

// interface Transfer {
//     account: string;
//     amount: number;
// }

// interface TransactionRecord {
//     result: string;
//     transfers: Transfer[];
//     memo: number;
// }

// interface TransactionData {
//     amount: number;
//     currency: string;
//     memo: string;
//     timestamp: string;
// }

// interface MirrorNodeResponse {
//     transactions: TransactionRecord[];
// }

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

    private dAppConnector: DAppConnector;
    private state: WalletState;

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
                // icons: ['https://www.hashfast.app/app-icon.png'],
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
                // icons: ['https://www.hashfast.app/app-icon.png'],
                url: 'https://testnet.hashfast.app',
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
            // Open the WalletConnect modal
            const session = await this.dAppConnector.openModal();
            // Once connected, handle and store the session information
            this.handleNewSession(session);

            return this.state;
        } catch (error) {
            console.error('Error connecting wallet:', error);

            // Provide helpful error messages
            if (error instanceof Error && error.message?.includes('scheme')) {
                console.error('Solution: Install HashPack or Blade wallet extension');
                console.error('HashPack: https://hashpack.app/');
                console.error('Blade: https://blade.xyz/');
            }

            throw error;
        }
    }

    // Get signer for the connected account
    getSigner(): DAppSigner | null {
        return this.state.signer || null;
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
        const hbarPriceUsd = data['hedera-hashgraph']?.usd;
        if (hbarPriceUsd == null) {
            throw new Error('HBAR price field missing');
        }

        const hbarPriceUsdc = hbarPriceUsd;

        return hbarPriceUsdc;
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
        let nettoAmount: number;

        nettoAmount = Number(link.amount);

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

                nettoAmount = (tinybarAmount - TINYBAR_FEE) / 100_000_000;
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

                nettoAmount = (usdcAmount - SCALED_USDC_FEE) / 1e6;
            } else {
                transaction = new TransferTransaction()
                    .addTokenTransfer(TokenId.fromString(this.usdcTokenId), fromAccount, -usdcAmount) //Sending account
                    .addTokenTransfer(TokenId.fromString(this.usdcTokenId), toAccount, usdcAmount); //Receiving account
            }
        } else {
            return { transactionId: null, receipt: null, nettoAmount };
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
        return { transactionId, receipt, nettoAmount };
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

    /** Fetch HBAR or USDC amount for a single transaction */
    private async fetchTransactionAmount(
        transactionId: string,
        receiverId: string,
        currency: 'hbar' | 'usdc',
    ): Promise<number> {
        const txId = this.parseTransactionId(transactionId);
        let res = await fetch(`${this.networkUrl}/api/v1/transactions/${txId}`);
        if (!res.ok) {
            // try other network
            const otherNetworkUrl =
                this.network === 'mainnet'
                    ? 'https://testnet.mirrornode.hedera.com'
                    : 'https://mainnet.mirrornode.hedera.com';
            res = await fetch(`${otherNetworkUrl}/api/v1/transactions/${txId}`);
            if (!res.ok) throw new Error('Failed to fetch transaction');
        }

        const data = await res.json();
        const tx = data.transactions[0];
        if (!tx) return 0;

        if (currency === 'hbar') {
            const transfer = tx.transfers?.find((t: any) => t.account === receiverId);
            return transfer ? Number(transfer.amount) / 100_000_000 : 0;
        } else {
            const tokenTransfer = tx.token_transfers?.find(
                (t: any) => t.token_id === this.usdcTokenId && t.account === receiverId,
            );
            return tokenTransfer ? tokenTransfer.amount / 1e6 : 0;
        }
    }

    /** Get total HBAR amount for multiple transactions */
    async getTotalHBARTransactionAmount(transactionIds: string[], receiverId: string): Promise<number> {
        const amounts = await Promise.all(
            transactionIds.map((id) => this.fetchTransactionAmount(id, receiverId, 'hbar')),
        );
        return parseFloat(amounts.reduce((a, b) => a + b, 0).toFixed(2));
    }

    /** Get total USDC amount for multiple transactions */
    async getTotalUSDCTransactionAmount(transactionIds: string[], receiverId: string): Promise<number> {
        const amounts = await Promise.all(
            transactionIds.map((id) => this.fetchTransactionAmount(id, receiverId, 'usdc')),
        );
        return parseFloat(amounts.reduce((a, b) => a + b, 0).toFixed(2));
    }

    /** Get single transaction amount (HBAR or USDC) */
    async getSingleTransactionAmount(transactionId: string, receiverId: string, currency: string): Promise<number> {
        // fetch HBAR
        if (currency === 'hbar') {
            const hbarAmount = await this.fetchTransactionAmount(transactionId, receiverId, 'hbar');
            if (hbarAmount > 0) return parseFloat(hbarAmount.toFixed(2));
        }
        // Otherwise fetch USDC
        const usdcAmount = await this.fetchTransactionAmount(transactionId, receiverId, 'usdc');
        return parseFloat(usdcAmount.toFixed(2));
    }
}
