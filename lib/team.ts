export type TeamMember = {
  name: string;
  role: string;
  image: string;
  text: string;
  pexelsUrl: string;
  photographer: string;
};

export const team: TeamMember[] = [
  {
    name: "Oscar Westdahl",
    role: "VD och personalansvarig",
    image: "/images/team/oscar.webp",
    text: "Oscar leder arbetet, följer upp våra mål och ser till att uppgifter hamnar rätt. Han har tidigare drivit ett eget vedföretag och arbetat med kundkontakt, marknadsföring och försäljning.",
    pexelsUrl: "https://www.pexels.com/photo/casual-male-portrait-with-neutral-background-32758452/",
    photographer: "Daniel Maurício Bertoli",
  },
  {
    name: "Axel Larsson",
    role: "Ekonomiansvarig",
    image: "/images/team/axel.webp",
    text: "Axel ansvarar för budget, kalkyler och bokföring. Han bidrar också till utvecklingen av chattbottarna och har erfarenhet av att bygga automatiserade arbetsflöden.",
    pexelsUrl: "https://www.pexels.com/photo/man-portrait-on-white-background-17675110/",
    photographer: "João Jesus",
  },
  {
    name: "Armin Madanee",
    role: "Försäljningsansvarig",
    image: "/images/team/armin.webp",
    text: "Armin håller kontakten med nya och befintliga kunder, formar lösningen efter deras behov och bidrar till produktutvecklingen. Han har erfarenhet av kundbemötande från Kärra Burgers.",
    pexelsUrl: "https://www.pexels.com/photo/portrait-of-a-thoughtful-young-man-against-neutral-background-31869535/",
    photographer: "Finn Gruber",
  },
  {
    name: "William de Andrade",
    role: "Marknads- och kommunikationsansvarig",
    image: "/images/team/william.webp",
    text: "William ansvarar för hur Sandside syns och kommunicerar. Fyra år som tennistränare har gett honom vana av att förklara tydligt och möta olika människor.",
    pexelsUrl: "https://www.pexels.com/photo/professional-portrait-of-a-young-man-30120552/",
    photographer: "Hao Peng",
  },
  {
    name: "Eskil Frånlund",
    role: "Produktions-, inköps- och hållbarhetsansvarig",
    image: "/images/team/eskil.webp",
    text: "Eskil bygger och testar lösningarna. Han ansvarar för byggprocessen, kvaliteten, inköpen och hållbarhetsarbetet från första version till färdig leverans.",
    pexelsUrl: "https://www.pexels.com/photo/portrait-of-a-young-man-with-studio-lighting-36712225/",
    photographer: "Lukas Kaufmann",
  },
];
