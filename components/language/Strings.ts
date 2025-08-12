export type LangCode = 'en' | 'da' | 'de';

// Maps display names from your settings to language codes
export function normalizeLanguage(input?: string): LangCode {
    switch ((input || '').toLowerCase()) {
        case 'dansk':
        case 'da':
            return 'da';
        case 'deutsch':
        case 'de':
            return 'de';
        default:
            return 'en';
    }
}

export const STRINGS: Record<LangCode, {
    greetings: {
        morning: string;
        afternoon: string;
        evening: string
    };
    home: {
        trackCaffeine: string;
        ring: {
            l1: string;
            l2p1: string;
            l2p2: string;
        };
        status: {
            none: string;
            low: string;
            moderate: string;
            high: string;
            excessive: string
        };
        stats: {
            todaysIntake: string;
            lastDrink: string;
            dailyLimit: string;
            agoAtBefore: string;
            agoAtAfter: string;
            drinksSuffix: string;
            mgActiveSuffix: string;
            remainingLabel: string;
            overLimitLabel: string;
        },
        addDrinkButton: {
            addDrink: string;
        }
        recent: {
            recentDrinks: string;
            seeAllDrinks: string;
            noDrinksLogged1: string;
            noDrinksLogged2: string;
        }
    };
    settings: {
        title: string
    },
    deleteConfirm : {
        title: string;
        text: string;
        cancel: string;
        delete: string;
        deleteAllDrinks: string;
        subText: string;
        deleteAll: string;
    };
}> = {
    en: {
        greetings: {
            morning: "Good morning",
            afternoon: "Good afternoon",
            evening: "Good evening",
        },
        home: {
            trackCaffeine: 'Track your caffeine intake',
            ring: {
                l1: "caffeine",
                l2p1: "of",
                l2p2: "daily",
            },
            status: {
                none: 'None',
                low: 'Low',
                moderate: 'Moderate',
                high: 'High',
                excessive: 'Excessive'
            },
            stats: {
                todaysIntake: "Today's Intake",
                lastDrink: 'Last Drink',
                dailyLimit: 'Daily Limit',
                agoAtBefore: 'ago at',
                agoAtAfter: '',
                drinksSuffix: 'drinks',
                mgActiveSuffix: 'mg active',
                remainingLabel: 'mg remaining',
                overLimitLabel: 'mg over limit',
            },
            addDrinkButton: {
                addDrink: "Add Drink",
            },
            recent: {
                recentDrinks: "Recent Drinks",
                seeAllDrinks: "See all →",
                noDrinksLogged1: "No drinks logged today",
                noDrinksLogged2: "Start tracking your caffeine intake by adding a drink",
            }
        },
        settings: {
            title: 'Settings'
        },
        deleteConfirm: {
            title: "Delete Drink",
            text: "Are you sure you want to remove this drink?",
            cancel: "Cancel",
            delete: "Delete",
            deleteAllDrinks: "Delete All Drinks",
            subText: "This will remove every drink entry. Are you sure?",
            deleteAll: "Delete All",
        },
    },
    da: {
        greetings: {
            morning: "Godmorgen",
            afternoon: "God eftermiddag",
            evening: "God aften",
        },
        home: {
            trackCaffeine: 'Spor dit koffeinindtag',
            ring: {
                l1: "koffein",
                l2p1: "af",
                l2p2: "daglig",
            },
            status: {
                none: 'Ingen',
                low: 'Lav',
                moderate: 'Moderat',
                high: 'Høj',
                excessive: 'Overdreven'
            },
            stats: {
                todaysIntake: 'Dagens indtag',
                lastDrink: 'Sidste drik',
                dailyLimit: 'Daglig grænse',
                agoAtBefore: 'siden kl.',
                agoAtAfter: 'siden',
                drinksSuffix: 'drikke',
                mgActiveSuffix: 'mg aktivt',
                remainingLabel: 'mg tilbage',
                overLimitLabel: 'mg over grænsen',
            },
            addDrinkButton: {
                addDrink: "Tilføj drikkevare",
            },
            recent: {
                recentDrinks: "Seneste drikkevarer",
                seeAllDrinks: "Se alle →",
                noDrinksLogged1: "Ingen drikkevarer registreret i dag",
                noDrinksLogged2: "Begynd at spore dit koffeinindtag ved at tilføje en drink",
            }

        },
        settings: {
            title: 'Indstillinger'
        },
        deleteConfirm: {
            title: "Slet Drik",
            text: "Er du sikker på, at du vil fjerne denne drik?",
            cancel: "Annuller",
            delete: "Slet",
            deleteAllDrinks: "Slet Alle Drikkevarer",
            subText: "Dette vil fjerne alle drikkevareposter. Er du sikker?",
            deleteAll: "Slet Alle",
        },
    },
    de: {
        greetings: {
            morning: "Guten Morgen",
            afternoon: "Guten Tag",
            evening: "Guten Abend",
        },
        home: {
            trackCaffeine: 'Verfolge deine Koffeinzufuhr',
            ring: {
                l1: "Koffein",
                l2p1: "von",
                l2p2: "täglich",
            },
            status: {
                none: 'Keine',
                low: 'Niedrig',
                moderate: 'Mittel',
                high: 'Hoch',
                excessive: 'Übermäßig'
            },
            stats: {
                todaysIntake: 'Heutige Aufnahme',
                lastDrink: 'Letztes Getränk',
                dailyLimit: 'Tageslimit',
                agoAtBefore: 'vor',
                agoAtAfter: '',
                drinksSuffix: 'Getränke',
                mgActiveSuffix: 'mg aktiv',
                remainingLabel: 'mg verbleibend',
                overLimitLabel: 'mg über dem Limit',
            },
            addDrinkButton: {
                addDrink: "Getränk Hinzufügen",
            },
            recent: {
                recentDrinks: "Aktuelle Getränke",
                seeAllDrinks: "Alles sehen →",
                noDrinksLogged1: "Heute keine Getränke protokolliert",
                noDrinksLogged2: "Starten Sie die Verfolgung",
            }
        },
        settings: {
            title: 'Einstellungen'
        },
        deleteConfirm: {
            title: "Getränk Löschen",
            text: "Möchten Sie dieses Getränk wirklich entfernen?",
            cancel: "Abbrechen",
            delete: "Löschen",
            deleteAllDrinks: "Alle Getränke Löschen",
            subText: "Dadurch werden alle Getränkeeinträge entfernt. Sind Sie sicher?",
            deleteAll: "Alle Löschen",
        },
    },
};