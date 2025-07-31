import { wallets } from 'cosmos-kit';
import { WalletConfig } from '@/types/wallet';

const stargazeWallets = [
  'keplr-extension',
  'keplr-mobile',
  'leap-extension',
  'leap-cosmos-mobile',
  'leap-metamask-cosmos-snap',
  'xdefi-extension',
  'station-extension',
  'cosmostation-extension'
];

// Add Initia-specific wallets
const initiaWallets = ['metamask', 'leap-extension', 'phantom'];

// Helper function to get wallet logo
const getWalletLogo = (walletName: string, logo?: string): string => {
  if (logo) return logo;

  // Fallback logos based on wallet name
  const logoMap: Record<string, string> = {
    'keplr-extension':
      'https://www.stargaze.zone/wallet-icons/wallet-icon-keplr.png',
    'keplr-mobile':
      'https://www.stargaze.zone/wallet-icons/wallet-icon-keplr.png',
    'leap-extension':
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTY2IiBoZWlnaHQ9IjE2NiIgdmlld0JveD0iMCAwIDE2NiAxNjYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF83ODBfNjEwKSI+CjxyZWN0IHdpZHRoPSIxNjYiIGhlaWdodD0iMTY2IiBmaWxsPSIjQzVGRkNFIi8+CjxwYXRoIGQ9Ik0xMzguNjE0IDEwMC40NDVDMTM4LjYxNCAxMjAuMjE3IDExNC40ODMgMTI4LjI1MiA4NC41MjE2IDEyOC4yNTJDNTQuNTYwMyAxMjguMjUyIDMwLjA3ODQgMTIwLjIxNyAzMC4wNzg0IDEwMC40NDVDMzAuMDc4NCA4MC42NzI0IDU0LjM4NDYgNjQuNjczIDg0LjM0NiA2NC42NzNDMTE0LjMwNyA2NC42NzMgMTM4LjYxNCA4MC43MDc0IDEzOC42MTQgMTAwLjQ0NVoiIGZpbGw9IiMyNEE5NUEiLz4KPHBhdGggZD0iTTEzMy4xMDMgNTcuMzQ3MkMxMzMuMTAzIDQ2LjkzNyAxMjQuNjAzIDM4LjQ4MzIgMTE0LjEzNiAzOC40ODMyQzEwOC42OTMgMzguNDgzMiAxMDMuNzg3IDQwLjc3MTkgMTAwLjMzIDQ0LjQxNzFDOTkuNzk0NCA0NC45ODE4IDk5LjAxMTggNDUuMjU2OSA5OC4yNDkgNDUuMTAyOUM5My44NjkgNDQuMjE4NSA4OS4yMzU1IDQzLjcyMzIgODQuNDU1NSA0My43MjMyQzc5LjY3NiA0My43MjMyIDc1LjA0MyA0NC4xODkzIDcwLjY2MzQgNDUuMDk1QzY5Ljg5OTggNDUuMjUyOSA2OS4xMTM4IDQ0Ljk4MjMgNjguNTc1IDQ0LjQxODZDNjUuMDkgNDAuNzcyNSA2MC4xODY3IDM4LjQ4MzIgNTQuNzc1MiAzOC40ODMyQzQ0LjMwOCAzOC40ODMyIDM1LjgwNzkgNDYuOTM3IDM1LjgwNzkgNTcuMzQ3MkMzNS44MDc5IDYwLjM4MzQgMzYuNTI2MiA2My4yMjczIDM3Ljc5MTMgNjUuNzU3QzM4LjA5NDMgNjYuMzYyOCAzOC4xMjQ4IDY3LjA3MjEgMzcuODYyNyA2Ny42OTY2QzM2LjYzNTMgNzAuNjIxMiAzNS45ODM1IDczLjcwOTEgMzUuOTgzNSA3Ni45MDk4QzM1Ljk4MzUgOTUuMjQ5OCA1Ny42OTA1IDExMC4wOTYgODQuNDU1NSAxMTAuMDk2QzExMS4yMjEgMTEwLjA5NiAxMzIuOTI4IDk1LjI0OTggMTMyLjkyOCA3Ni45MDk4QzEzMi45MjggNzMuNzA5MSAxMzIuMjc2IDcwLjYyMTIgMTMxLjA0OCA2Ny42OTY2QzEzMC43ODYgNjcuMDcyMSAxMzAuODE3IDY2LjM2MjggMTMxLjEyIDY1Ljc1N0MxMzIuMzg1IDYzLjIyNzMgMTMzLjEwMyA2MC4zODM0IDEzMy4xMDMgNTcuMzQ3MloiIGZpbGw9IiMzMkRBNkQiLz4KPHBhdGggZD0iTTUzLjIyNzEgNjcuODExOUM1OS42Mjg3IDY3LjgxMTkgNjQuODE4MyA2Mi42NTA2IDY0LjgxODMgNTYuMjgzOUM2NC44MTgzIDQ5LjkxNzEgNTkuNjI4NyA0NC43NTU5IDUzLjIyNzEgNDQuNzU1OUM0Ni44MjU1IDQ0Ljc1NTkgNDEuNjM2IDQ5LjkxNzEgNDEuNjM2IDU2LjI4MzlDNDEuNjM2IDYyLjY1MDYgNDYuODI1NSA2Ny44MTE5IDUzLjIyNzEgNjcuODExOVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMTUuMDY1IDY3LjgxMTlDMTIxLjQ2NiA2Ny44MTE5IDEyNi42NTYgNjIuNjUwNiAxMjYuNjU2IDU2LjI4MzlDMTI2LjY1NiA0OS45MTcxIDEyMS40NjYgNDQuNzU1OSAxMTUuMDY1IDQ0Ljc1NTlDMTA4LjY2MyA0NC43NTU5IDEwMy40NzQgNDkuOTE3MSAxMDMuNDc0IDU2LjI4MzlDMTAzLjQ3NCA2Mi42NTA2IDEwOC42NjMgNjcuODExOSAxMTUuMDY1IDY3LjgxMTlaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDcuMDc1OSAxMjYuODI5QzQ5LjU2OTggMTI2LjgyOSA1MS41MzY4IDEyNC42NjMgNTEuMjU1OCAxMjIuMjE4QzUwLjIzNzIgMTEzLjU1NCA0NS45MTY4IDk0Ljc5NSAyNi45MTQ0IDgzLjUxMTVDNi4wODM2OCA3MS4xMzg3IDE1Ljk5NDEgMTA0LjAzNCAyMC4xMzY1IDExNi4wMTlDMjAuOTc0NCAxMTguNDQzIDIwLjAwMjcgMTIxLjEzNSAxNy43NzgzIDEyMi40MTFMMTYuNDEyMSAxMjMuMTk2QzE0LjY1NTkgMTI0LjIwOSAxNS4zOTM1IDEyNi44MjkgMTcuMzk1NiAxMjYuODI5SDQ3LjA3NTlaIiBmaWxsPSIjMzJEQTZEIi8+CjxwYXRoIGQ9Ik0xMjIuNTY2IDEyNi44MjlDMTIwLjMxOCAxMjYuODI5IDExOC41NjIgMTI0LjY2MyAxMTguODA4IDEyMi4yMThDMTE5LjY4NiAxMTMuNTg5IDEyMy42MiA5NC43OTUgMTQwLjc2MSA4My41MTE1QzE1OS43NDEgNzEuMDQyNiAxNTAuNTAzIDEwNC41NDcgMTQ2LjgxNSAxMTYuMjk0QzE0Ni4wOTIgMTE4LjU5OCAxNDYuOTgyIDEyMS4xMDYgMTQ5LjAyMiAxMjIuMzk5TDE1MC4yOCAxMjMuMTk2QzE1MS44NiAxMjQuMjA5IDE1MS4xOTMgMTI2LjgyOSAxNDkuNDAyIDEyNi44MjlIMTIyLjU2NloiIGZpbGw9IiMzMkRBNkQiLz4KPHBhdGggZD0iTTUzLjI0MjggNjMuMTc4N0M1Ny4wNjE3IDYzLjE3ODcgNjAuMTU3NiA2MC4wODI4IDYwLjE1NzYgNTYuMjYzOUM2MC4xNTc2IDUyLjQ0NSA1Ny4wNjE3IDQ5LjM0OTEgNTMuMjQyOCA0OS4zNDkxQzQ5LjQyMzkgNDkuMzQ5MSA0Ni4zMjggNTIuNDQ1IDQ2LjMyOCA1Ni4yNjM5QzQ2LjMyOCA2MC4wODI4IDQ5LjQyMzkgNjMuMTc4NyA1My4yNDI4IDYzLjE3ODdaIiBmaWxsPSIjMDkyNTExIi8+CjxwYXRoIGQ9Ik0xMTUuMDgxIDYzLjE3ODdDMTE4LjkgNjMuMTc4NyAxMjEuOTk1IDYwLjA4MjggMTIxLjk5NSA1Ni4yNjM5QzEyMS45OTUgNTIuNDQ1IDExOC45IDQ5LjM0OTEgMTE1LjA4MSA0OS4zNDkxQzExMS4yNjIgNDkuMzQ5MSAxMDguMTY2IDUyLjQ0NSAxMDguMTY2IDU2LjI2MzlDMTA4LjE2NiA2MC4wODI4IDExMS4yNjIgNjMuMTc4NyAxMTUuMDgxIDYzLjE3ODdaIiBmaWxsPSIjMDkyNTExIi8+CjxwYXRoIGQ9Ik05OS43OTk1IDgzLjAxNzZDMTAxLjUxNCA4My4xNjUxIDEwMi44MSA4NC42ODYyIDEwMi4zNzggODYuMzUxOEMxMDIuMDI5IDg3LjY5NzkgMTAxLjUyOSA4OS4wMDM5IDEwMC44ODYgOTAuMjQ0MkM5OS43NjMgOTIuNDA5IDk4LjIyNDYgOTQuMzMxNSA5Ni4zNTg2IDk1LjkwMThDOTQuNDkyNyA5Ny40NzIyIDkyLjMzNTcgOTguNjU5NiA5MC4wMTA4IDk5LjM5NjNDODcuNjg2IDEwMC4xMzMgODUuMjM4OCAxMDAuNDA1IDgyLjgwOSAxMDAuMTk2QzgwLjM3OTEgOTkuOTg2NiA3OC4wMTQzIDk5LjMwMSA3NS44NDk0IDk4LjE3OEM3My42ODQ2IDk3LjA1NTEgNzEuNzYyMSA5NS41MTY3IDcwLjE5MTcgOTMuNjUwN0M2OC42MjE0IDkxLjc4NDggNjcuNDM0IDg5LjYyNzggNjYuNjk3MiA4Ny4zMDI5QzY2LjE3MDEgODUuNjM5NiA2NS44ODExIDgzLjkxMzUgNjUuODM1OSA4Mi4xNzYxQzY1LjgwNiA4MS4wMjk0IDY2LjgyNDQgODAuMTgwOCA2Ny45NjczIDgwLjI3OTFMODQuNDAwNyA4MS42OTI4TDk5Ljc5OTUgODMuMDE3NloiIGZpbGw9IiMwOTI1MTEiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF83ODBfNjEwIj4KPHJlY3Qgd2lkdGg9IjE2NiIgaGVpZ2h0PSIxNjYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==',
    'leap-cosmos-mobile': 'https://assets.leapwallet.io/logo.svg',
    'leap-metamask-cosmos-snap': 'https://metamask.io/img/favicon.ico',
    'xdefi-extension': 'https://xdefi.io/favicon.ico',
    'station-extension':
      'https://assets.terra.money/img/wallet-providers/station.svg',
    'cosmostation-extension': 'https://wallet.cosmostation.io/favicon.ico',
    metamask:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEwIiBoZWlnaHQ9IjIxMCIgdmlld0JveD0iMCAwIDIxMCAyMTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNzguMzQ0IDE0Ljk2NDhMMTE0LjkzOSA2My41NTU4TDEyNi42NjQgMzQuODg3OEwxNzguMzQ0IDE0Ljk2NDhaIiBmaWxsPSIjRTI3NjFCIiBzdHJva2U9IiNFMjc2MUIiIHN0cm9rZS13aWR0aD0iMC42MzkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMzEuOTcxOCAxNC45NjQ4TDk0Ljg2NjggNjQuMDE2OEw4My43MTQ4IDM0Ljg4NzhMMzEuOTcxOCAxNC45NjQ4Wk0xNTUuNTMxIDEyNy42TDEzOC42NDQgMTU0LjI5NkwxNzQuNzc1IDE2NC41NTNMMTg1LjE2MiAxMjguMTkyTDE1NS41MzEgMTI3LjZaTTI1LjI4MDggMTI4LjE5MkwzNS42MDM4IDE2NC41NTNMNzEuNzM0OCAxNTQuMjk2TDU0Ljg0OTggMTI3LjZMMjUuMjgwOCAxMjguMTkyWiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2Utd2lkdGg9IjAuNjM5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTY5LjY5NjkgODIuNDkxNEw1OS42Mjk5IDk4LjIwNjRMOTUuNTA1OSA5OS44NTA0TDk0LjIzMTkgNjAuMDcwNEw2OS42OTY5IDgyLjQ5MTRaTTE0MC42MjEgODIuNDkxNEwxMTUuNzY5IDU5LjYwOTRMMTE0Ljk0IDk5Ljg1MDRMMTUwLjc1MyA5OC4yMDY0TDE0MC42MjEgODIuNDkxNFpNNzEuNzM1OSAxNTQuMjk0TDkzLjI3NDkgMTQzLjQ0NEw3NC42NjY5IDEyOC40NTNMNzEuNzM1OSAxNTQuMjk0Wk0xMTcuMDQzIDE0My40NDRMMTM4LjY0NSAxNTQuMjk0TDEzNS42NSAxMjguNDUzTDExNy4wNDMgMTQzLjQ0NFoiIGZpbGw9IiNFNDc2MUIiIHN0cm9rZT0iI0U0NzYxQiIgc3Ryb2tlLXdpZHRoPSIwLjYzOSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMzguNjQzIDE1NC4yOTVMMTE3LjA0MSAxNDMuNDQ1TDExOC43NjIgMTU3Ljk3N0wxMTguNTcxIDE2NC4wOTJMMTM4LjY0MyAxNTQuMjk1Wk03MS43MzM5IDE1NC4yOTVMOTEuODA2OSAxNjQuMDkyTDkxLjY3OTkgMTU3Ljk3N0w5My4yNzI5IDE0My40NDVMNzEuNzMzOSAxNTQuMjk1WiIgZmlsbD0iI0Q3QzFCMyIgc3Ryb2tlPSIjRDdDMUIzIiBzdHJva2Utd2lkdGg9IjAuNjM5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTkyLjEyNTggMTE4Ljg1NUw3NC4xNTU4IDExMy4zOThMODYuODM2OCAxMDcuNDE0TDkyLjEyNTggMTE4Ljg1NVpNMTE4LjE4OSAxMTguODU1TDEyMy40NzggMTA3LjQxNEwxMzYuMjIyIDExMy4zOThMMTE4LjE4OSAxMTguODU1WiIgZmlsbD0iIzIzMzQ0NyIgc3Ryb2tlPSIjMjMzNDQ3IiBzdHJva2Utd2lkdGg9IjAuNjM5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTcxLjczNjEgMTU0LjI5NEw3NC43OTUxIDEyNy41OTlMNTQuODUwMSAxMjguMTlMNzEuNzM2MSAxNTQuMjk0Wk0xMzUuNTg3IDEyNy41OTlMMTM4LjY0NSAxNTQuMjk0TDE1NS41MzIgMTI4LjE5TDEzNS41ODcgMTI3LjU5OVpNMTUwLjc1MyA5OC4yMDdMMTE0Ljk0IDk5Ljg1MUwxMTguMjU0IDExOC44NTNMMTIzLjU0MyAxMDcuNDEyTDEzNi4yODggMTEzLjM5NkwxNTAuNzUzIDk4LjIwN1pNNzQuMTU4MSAxMTMuMzk2TDg2LjkwMjEgMTA3LjQxMkw5Mi4xMjcxIDExOC44NTNMOTUuNTA1MSA5OS44NTFMNTkuNjI5MSA5OC4yMDdMNzQuMTU4MSAxMTMuMzk2WiIgZmlsbD0iI0NENjExNiIgc3Ryb2tlPSIjQ0Q2MTE2IiBzdHJva2Utd2lkdGg9IjAuNjM5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTU5LjYyODkgOTguMjEwOUw3NC42Njc5IDEyOC40NTdMNzQuMTU3OSAxMTMuNEw1OS42Mjc5IDk4LjIxMDlINTkuNjI4OVpNMTM2LjI4OCAxMTMuNEwxMzUuNjUgMTI4LjQ1N0wxNTAuNzUzIDk4LjIxMDlMMTM2LjI4OCAxMTMuNFpNOTUuNTA0OSA5OS44NTQ5TDkyLjEyNzkgMTE4Ljg1N0w5Ni4zMzI5IDE0MS4yNzlMOTcuMjg4OSAxMTEuNzU2TDk1LjUwNDkgOTkuODU0OVpNMTE0Ljk0IDk5Ljg1NDlMMTEzLjIyIDExMS42OUwxMTMuOTg1IDE0MS4yNzlMMTE4LjI1NCAxMTguODU3TDExNC45NCA5OS44NTQ5WiIgZmlsbD0iI0U0NzUxRiIgc3Ryb2tlPSIjRTQ3NTFGIiBzdHJva2Utd2lkdGg9IjAuNjM5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTExOC4yNTMgMTE4Ljg1M0wxMTMuOTgzIDE0MS4yNzVMMTE3LjA0MiAxNDMuNDQ1TDEzNS42NDkgMTI4LjQ1M0wxMzYuMjg2IDExMy4zOTVMMTE4LjI1MyAxMTguODUzWk03NC4xNTU4IDExMy4zOTVMNzQuNjY1OCAxMjguNDUzTDkzLjI3MjggMTQzLjQ0NUw5Ni4zMzE4IDE0MS4yNzVMOTIuMTI1OCAxMTguODUzTDc0LjE1NTggMTEzLjM5NVoiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLXdpZHRoPSIwLjYzOSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMTguNTcxIDE2NC4wOTRMMTE4Ljc2MiAxNTcuOTc5TDExNy4xNjkgMTU2LjUzMkg5My4xNDQ5TDkxLjY3OTkgMTU3Ljk3OUw5MS44MDY5IDE2NC4wOTRMNzEuNzMzOSAxNTQuMjk3TDc4Ljc0MzkgMTYwLjIxNUw5Mi45NTM5IDE3MC40MDZIMTE3LjM2TDEzMS42MzQgMTYwLjIxNUwxMzguNjQzIDE1NC4yOTdMMTE4LjU3MSAxNjQuMDk0WiIgZmlsbD0iI0MwQUQ5RSIgc3Ryb2tlPSIjQzBBRDlFIiBzdHJva2Utd2lkdGg9IjAuNjM5IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTExNy4wNDEgMTQzLjQ0N0wxMTMuOTgzIDE0MS4yNzdIOTYuMzMyMkw5My4yNzIyIDE0My40NDdMOTEuNjgwMiAxNTcuOTc5TDkzLjE0NTIgMTU2LjUzMkgxMTcuMTY5TDExOC43NjIgMTU3Ljk3OUwxMTcuMDQxIDE0My40NDdaIiBmaWxsPSIjMTYxNjE2IiBzdHJva2U9IiMxNjE2MTYiIHN0cm9rZS13aWR0aD0iMC42MzkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTgxLjAyIDY2LjcxMjhMMTg2LjQzNyAzOS44ODQ4TDE3OC4zNDQgMTQuOTY0OEwxMTcuMDQzIDYxLjkxMThMMTQwLjYyIDgyLjQ5MjhMMTczLjk0NyA5Mi41NTI4TDE4MS4zMzkgODMuNjc2OEwxNzguMTUzIDgxLjMwOThMMTgzLjI1MSA3Ni41MDk4TDE3OS4zIDczLjM1MzhMMTg0LjM5OCA2OS4zNDI4TDE4MS4wMiA2Ni43MTI4Wk0yMy45NDI5IDM5Ljg4NDhMMjkuMzU5OSA2Ni43MTI4TDI1LjkxODkgNjkuMzQyOEwzMS4wMTY5IDczLjM1MjhMMjcuMTI5OSA3Ni41MDk4TDMyLjIyNjkgODEuMzA5OEwyOS4wNDA5IDgzLjY3NjhMMzYuMzY4OSA5Mi41NTI4TDY5LjY5NTkgODIuNDkyOEw5My4yNzM5IDYxLjkxMjhMMzEuOTcxOSAxNC45NjQ4TDIzLjk0MjkgMzkuODg0OFoiIGZpbGw9IiM3NjNEMTYiIHN0cm9rZT0iIzc2M0QxNiIgc3Ryb2tlLXdpZHRoPSIwLjYzOSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNzMuOTQ3IDkyLjU1MTdMMTQwLjYyIDgyLjQ5MTdMMTUwLjc1MiA5OC4yMDY3TDEzNS42NDkgMTI4LjQ1M0wxNTUuNTMxIDEyOC4xOUgxODUuMTYyTDE3My45NDcgOTIuNTUxN1pNNjkuNjk2OCA4Mi40OTE3TDM2LjM2ODggOTIuNTUxN0wyNS4yODA4IDEyOC4xOUg1NC44NDk4TDc0LjY2NzggMTI4LjQ1M0w1OS42Mjc4IDk4LjIwNjdMNjkuNjk2OCA4Mi40OTE3Wk0xMTQuOTM5IDk5Ljg1MDdMMTE3LjA0MiA2MS45MTA3TDEyNi43MjggMzQuODg2N0g4My43MTQ4TDkzLjI3MzggNjEuOTEwN0w5NS41MDM4IDk5Ljg1MDdMOTYuMjY4OCAxMTEuODE4TDk2LjMzMTggMTQxLjI3NUgxMTMuOTg0TDExNC4xMTEgMTExLjgxOEwxMTQuOTM5IDk5Ljg1MDdaIiBmaWxsPSIjRjY4NTFCIiBzdHJva2U9IiNGNjg1MUIiIHN0cm9rZS13aWR0aD0iMC42MzkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K',
    phantom:
      'https://s9oawqeuub.ufs.sh/f/Ae0rhpcXcgiTs9VyMce3eBWb02Gt5mJHpAd9EifglZFz1XyU'
  };

  return logoMap[walletName] || 'https://via.placeholder.com/32x32?text=W';
};

// Helper function to get wallet color scheme
const getWalletColor = (walletName: string): string => {
  const colorMap: Record<string, string> = {
    'keplr-extension': 'from-blue-500 to-purple-600',
    'keplr-mobile': 'from-blue-500 to-purple-600',
    'leap-extension': 'from-orange-500 to-red-600',
    'leap-cosmos-mobile': 'from-orange-500 to-red-600',
    'leap-metamask-cosmos-snap': 'from-orange-400 to-yellow-500',
    'xdefi-extension': 'from-cyan-500 to-blue-600',
    'station-extension': 'from-green-500 to-blue-600',
    'cosmostation-extension': 'from-purple-500 to-indigo-600',
    metamask: 'from-orange-400 to-yellow-500',
    phantom: 'from-purple-500 to-indigo-600'
  };

  return colorMap[walletName] || 'from-gray-500 to-gray-700';
};

// Helper function to get wallet download URLs
const getWalletDownloadUrl = (walletName: string): string => {
  const downloadMap: Record<string, string> = {
    metamask: 'https://metamask.io/download/',
    'leap-extension':
      'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    phantom: 'https://phantom.app/download'
  };

  return downloadMap[walletName] || '';
};

// Generate STARGAZE_WALLETS from cosmos-kit wallets
const cosmosWallets: WalletConfig[] = wallets
  .filter((wallet) => {
    return stargazeWallets.includes(wallet.walletName);
  })
  .map((wallet) => ({
    id: wallet.walletName,
    name: wallet.walletInfo.prettyName || wallet.walletName,
    logo:
      typeof wallet.walletInfo.logo === 'string'
        ? (wallet.walletInfo.logo as string)
        : wallet.walletInfo.logo?.major ?? '',
    description:
      wallet.walletInfo.description ||
      `${
        wallet.walletInfo.prettyName || wallet.walletName
      } wallet for Stargaze network`,
    color: getWalletColor(wallet.walletName),
    supportedTypes: ['stargaze'] as ('stargaze' | 'evm' | 'intergaze')[],
    downloadUrl:
      wallet.walletInfo?.downloads?.[0]?.link ??
      (typeof wallet.appUrl === 'string' ? wallet.appUrl : undefined)
  }))
  .filter(
    (wallet, index, self) =>
      index === self.findIndex((w) => w.name === wallet.name)
  );

// Add Initia-specific wallets
const initiaWalletConfigs: WalletConfig[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    logo: getWalletLogo('metamask'),
    description: 'Connect using MetaMask wallet for Initia networks',
    color: getWalletColor('metamask'),
    supportedTypes: ['intergaze', 'evm'],
    downloadUrl: getWalletDownloadUrl('metamask')
  },
  {
    id: 'keplr-extension',
    name: 'Keplr Wallet',
    logo: getWalletLogo('keplr-extension'),
    description: 'Connect using Keplr wallet for Initia networks',
    color: getWalletColor('keplr-extension'),
    supportedTypes: ['intergaze'],
    downloadUrl: getWalletDownloadUrl('keplr-extension')
  },
  {
    id: 'leap-extension',
    name: 'Leap Wallet',
    logo: getWalletLogo('leap-extension'),
    description: 'Connect using Leap wallet for multiple networks',
    color: getWalletColor('leap-extension'),
    supportedTypes: ['stargaze', 'intergaze'],
    downloadUrl: getWalletDownloadUrl('leap-extension')
  },
  {
    id: 'leap-cosmos-mobile',
    name: 'Leap Wallet (Mobile)',
    logo: getWalletLogo('leap-cosmos-mobile'),
    description: 'Connect using Leap mobile wallet for multiple networks',
    color: getWalletColor('leap-cosmos-mobile'),
    supportedTypes: ['stargaze', 'intergaze'],
    downloadUrl: 'https://apps.apple.com/app/leap-cosmos-wallet/id1642465549'
  },
  {
    id: 'phantom',
    name: 'Phantom',
    logo: getWalletLogo('phantom'),
    description: 'Connect using Phantom wallet for Initia networks',
    color: getWalletColor('phantom'),
    supportedTypes: ['intergaze'],
    downloadUrl: getWalletDownloadUrl('phantom')
  }
];

// Combined wallet list
export const STARGAZE_WALLETS: WalletConfig[] = [
  ...cosmosWallets,
  ...initiaWalletConfigs
];

// Export wallet names for cosmos-kit integration
export const STARGAZE_WALLET_NAMES = STARGAZE_WALLETS.map(
  (wallet) => wallet.id
);

// Helper function to get specific wallet config
export const getWalletConfig = (walletId: string): WalletConfig | undefined => {
  return STARGAZE_WALLETS.find((wallet) => wallet.id === walletId);
};

// Helper function to check if wallet is available
export const isWalletAvailable = (walletId: string): boolean => {
  // For Initia wallets, check if they're installed
  if (initiaWallets.includes(walletId)) {
    return true; // We'll check installation in the wallet service
  }
  return wallets.some((wallet) => wallet.walletName === walletId);
};

// Get wallets by supported chain type
export const getWalletsByChainType = (
  chainType: 'stargaze' | 'intergaze' | 'evm'
): WalletConfig[] => {
  return STARGAZE_WALLETS.filter((wallet) =>
    wallet.supportedTypes.includes(chainType)
  );
};

// Get wallets that support specific chain ID
export const getWalletsForChain = (chainId: string): WalletConfig[] => {
  if (chainId === 'stargaze-1') {
    return getWalletsByChainType('stargaze');
  } else if (chainId === 'initia-1' || chainId.startsWith('intergaze')) {
    return getWalletsByChainType('intergaze');
  } else {
    return [];
  }
};
