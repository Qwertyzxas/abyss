"use client";

import dynamic from "next/dynamic";
import { LocaleProvider, useLocale } from "@/lib/i18n";
import { Bestiary } from "./Bestiary";
import { Choreography } from "./Choreography";
import { DepthGauge } from "./DepthGauge";
import { DiveController } from "./DiveController";
import { Divers } from "./Divers";
import { FirstDive } from "./FirstDive";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { ZoneSection } from "./ZoneSection";

const Ocean = dynamic(() => import("./ocean/Ocean"), { ssr: false });

function Descent() {
  const { t } = useLocale();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <div id="zones">
          {t.zones.map((zone) => (
            <ZoneSection key={zone.id} zone={zone} />
          ))}
        </div>
        <FirstDive />
        <Divers />
        <Bestiary />
      </main>
      <Footer />
      <DepthGauge />
    </>
  );
}

export function Experience() {
  return (
    <LocaleProvider>
      <Ocean />
      <DiveController />
      <Choreography />
      <Descent />
    </LocaleProvider>
  );
}
