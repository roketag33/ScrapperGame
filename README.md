<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Scrapper-Config

Application de scraping pour comparer les prix des composants PC Gaming sur différents sites e-commerce.

## Description

Cette application NestJS permet de scraper plusieurs sites de vente de composants informatiques pour trouver les meilleurs prix. L'application utilise Playwright pour naviguer sur les sites web et extraire les informations pertinentes sur les produits.

## Fonctionnalités

- Scraping de LDLC pour extraire les prix des composants PC
- Comparaison des prix entre différents sites (en cours de développement)
- API REST pour accéder aux données scrapées
- Support de différentes catégories de produits (cartes graphiques, processeurs, etc.)
- Recherche par mot-clé

## Installation

```bash
# Installation des dépendances
yarn install

# Installation des navigateurs pour Playwright
npx playwright install
```

## Lancement de l'application

```bash
# Mode développement
yarn start:dev

# Mode production
yarn start:prod
```

## Utilisation de l'API

### Scraper LDLC

```
GET /scraping/ldlc?categorie=carte-graphique&motCle=rtx
```

Paramètres :
- `categorie` (optionnel, par défaut: carte-graphique) : La catégorie de produits à scraper
- `motCle` (optionnel) : Mot-clé pour filtrer les résultats

### Comparer les prix entre sites

```
GET /scraping/comparer?categorie=carte-graphique&motCle=rtx
```

Paramètres identiques à l'endpoint LDLC.

## Développement

### Structure du projet

- `src/scraping/scraping.service.ts` : Contient les services de scraping pour chaque site
- `src/scraping/scraping.controller.ts` : Contrôleur exposant les endpoints REST
- `src/scraping/interfaces/produit.interface.ts` : Interface définissant le format des données de produit

### Technologies utilisées

- NestJS : Framework backend Node.js
- Playwright : Automatisation de navigateur pour le scraping
- Cheerio : Parsing HTML
- Axios : Requêtes HTTP

## Roadmap

- [x] Scraping de LDLC
- [ ] Ajout de TopAchat
- [ ] Ajout de Materiel.net
- [ ] Interface utilisateur front-end
- [ ] Historique des prix
- [ ] Alertes de prix

## Licence

MIT

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
