let initialState = {
    SenderAddress: null,
    SenderType: null,
    SenderHandle: null,
    RegisteredAccounts: [],
    SenderPayments: [],           //not set
    isRegisteredUser: false,
    AccountsContract: null,
    web3: null,
    provider: null,
    isFetching: false
}

export default initialState;