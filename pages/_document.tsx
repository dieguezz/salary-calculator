import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=6"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          data-n-head="true"
          sizes="16x16"
          type="image/png"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          data-n-head="true"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-96x96.png"
          rel="icon"
          data-n-head="true"
          sizes="96x96"
          type="image/png"
        />
        <link
          rel="preconnect"
          href="https://europe-west2-finance-tools-5919b.cloudfunctions.net"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Calcula el coste que le supone a tu empresa contratar a un trabajador en base a su salario bruto mensual."
        />
        <meta
          name="keywords"
          content="calculadora, coste trabajador, coste trabajador para la empresa"
        />
        <link rel="apple-touch-icon" href="/logo192.png" />
        {/* manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/ */}
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              url: "https://www.calcularcostetrabajador.com",
              name: "Calcular coste trabajador",
              copyrightYear: "2019",
              about:
                "Calcula el coste que le supone a tu empresa contratar a un trabajador en base a su salario bruto anual.",
              countriesSupported: "ES",
              copyrightHolder: "etéreo experience S.L.",
              browserRequirements: "IE7+",
              applicationCategory: "Finanzas",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+34-636-648-939",
                contactType: "Customer service",
              },
            }),
          }}
        ></script>
        
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
