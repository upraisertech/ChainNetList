import * as React from "react";
import { useRouter } from "next/router";
// import { useTranslations } from "next-intl";
import { notTranslation as useTranslations } from "../../utils";
import { formatAddress, getProvider, useDebounce } from "../../utils";
import { walletIcons } from "../../constants/walletIcons";
import useConnect from "../../hooks/useConnect";
import useAccount from "../../hooks/useAccount";
import Switch from 'react-switch';

function Header({ lang, chainName }) {
  const t = useTranslations("Common", lang);

  const router = useRouter();

  const { testnets, testnet, search } = router.query;

  const includeTestnets =
    (typeof testnets === "string" && testnets === "true") || (typeof testnet === "string" && testnet === "true");

  const toggleTestnets = () =>
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, testnets: !includeTestnets },
      },
      undefined,
      { shallow: true },
    );

  const [searchTerm, setSearchTerm] = React.useState(chainName);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if ((!debouncedSearchTerm || debouncedSearchTerm === "") && (!search || search === "")) {
        return;
      }

      router.push(
        {
          pathname: router.pathname.includes("/chain/") ? "/" : router.pathname,
          query: { ...router.query, search: debouncedSearchTerm },
        },
        undefined,
        { shallow: true },
      );
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearchTerm]);

  const { mutate: connectWallet } = useConnect();

  const { data: accountData } = useAccount();

  const address = accountData?.address ?? null;

  return (
    <div className="sticky top-0 z-50 rounded-[10px] dark:bg-[#181818] bg-[#f3f3f3] p-5 -m-5">
      <header className="flex items-end gap-2 w-full sticky top-4 shadow rounded-[10px] z-50">
        <div className="flex flex-col-reverse dark:bg-[#0D0D0D] bg-white rounded-[10px] flex-1">
          <div className="rounded-b-[10px] shadow-sm">
            <label className="flex sm:items-center flex-col sm:flex-row focus-within:ring-2 dark:ring-[#dc484887] ring-[#dc484887] rounded-b-[10px]">
              <span className="font-bold text-sm dark:text-[#B3B3B3] text-black whitespace-nowrap px-3 pt-4 sm:pt-0">
                {t("search-networks")}
              </span>
              <input
                placeholder="ETH, Fantom, ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={(input) => input && input.focus()}
                className="dark:bg-[#0D0D0D] bg-white dark:text-[#B3B3B3] text-black flex-1 px-3 sm:px-2 pb-4 pt-2 sm:py-4 outline-none"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="dark:stroke-[#B3B3B3] stroke-black w-4 h-4 mr-3 hidden sm:block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </label>
          </div>
          <div className="dark:text-[#B3B3B3] text-black py-2 px-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div></div>
            <div className="flex items-center gap-6">
              <label title="Include Testnets" className="flex items-center">
                <Switch
                  onChange={toggleTestnets}
                  checked={includeTestnets}
                  id="testnets-switch"
                  onColor="#dc4848"
                  offColor="#ccc" // Change the off color as needed
                />
                {/* <span>Include Testnets</span> */}
              </label>

              <button
                className="flex gap-2 items-center dark:bg-[#dc484887] bg-[#dc484887] justify-center rounded-[10px] py-[8px] px-2 font-medium dark:text-[#B3B3B3] text-white border dark:hover:text-white hover:text-[#dc484887] dark:hover:bg-black hover:bg-white w-full"
                onClick={connectWallet}
              >
                {address ? (
                  <>
                    <img src={walletIcons[getProvider()]} width={20} height={20} alt="" />
                    <span>{formatAddress(address)}</span>
                  </>
                ) : (
                  t("connect-wallet")
                )}
              </button>
            </div>

          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
