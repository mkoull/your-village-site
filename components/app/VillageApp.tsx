"use client";
import { AppContext } from "./AppContext";
import AppFrame from "./AppFrame";
import { AppHome, Explore, ProviderProfile, SavedProviders } from "./Discovery";
import { Requests, RequestDetail } from "./Requests";
import { SignIn, AccountPrivacy } from "./Accounts";
import { Partner, Owner } from "./Workspaces";
import { Empty } from "./AppUI";
export default function VillageApp({ screen }: { screen: string[] }) {
  const route = screen.join("/");
  let content;
  if (!route) content = <AppHome/>;
  else if (route === "explore") content = <Explore/>;
  else if (route === "saved") content = <SavedProviders/>;
  else if (route === "requests") content = <Requests/>;
  else if (screen[0] === "requests" && screen.length === 2) content = <RequestDetail id={screen[1]}/>;
  else if (screen[0] === "providers" && screen.length === 2) content = <ProviderProfile id={screen[1]}/>;
  else if (route === "sign-in") content = <SignIn/>;
  else if (route === "partner" || route === "join") content = <Partner/>;
  else if (route === "owner") content = <Owner/>;
  else if (route === "privacy") content = <AccountPrivacy/>;
  else content = <Empty asTitle title="Let’s find your way back." href="/app" action="Back to your village">This page isn’t part of your village. Your saved support and requests are still in their usual places.</Empty>;
  return <AppContext><AppFrame>{content}</AppFrame></AppContext>;
}
