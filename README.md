<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/PolMrt/genius-social/main/.github/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/PolMrt/genius-social/main/.github/logo-light.svg">
    <img alt="Genius.Social" src="https://raw.githubusercontent.com/PolMrt/genius-social/main/.github/logo-light.svg" width="350" height="70" style="max-width: 100%;">
  </picture>
</p>

<p align="center">
  Access multiple Instagram accounts' insights in one place.
</p>

---

> [!WARNING]  
> The status of this project is **unmaintained**.
> Meta refused all of our requests to access the Instagram API, that is the reason we decided to stop the development of this project and make it open source.

The goal of this project was to create a website to help agencies retrieving insights from their creators' Instagram account. It works by connecting Instagram account to a space and shows all the insights in that space.

This project goal was to extend the current website [genius.social](https://www.genius.social/).

## Preview of the website

![Top of the account's insights tab, shows Instagram followers/following and selection of a date range](.github/screenshots/account-insights.png)
![Middle of the account's insights tab, shows graphs about reach and impressions](.github/screenshots/account-insights-2.png)
![Shows users last post like and comment count](.github/screenshots/posts-insights.png)

## How it works

The website is built with React and uses the Instagram API to retrieve the data from the user's account. The user can connect his account to the website and then the website will retrieve the data from the user's account.

The process to do so is the following:

- The agency generate an unique link on the website
- The talent clicks on the link and connects his Instagram account to the website
- The website retrieves the data from the talent's account and displays it to the agency
