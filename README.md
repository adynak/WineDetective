# WineDetective
You bought it and brought it home, but where did you put it?  This is a simple wine inventory app to help you find and drink the wine you have stored in locations throughout your cellar.

## Getting Started

You have a few things to get in place before using this app in your environment

### Prerequisites

Load these software packages.

```
node and npm
```

```
php 5.5
```

```
postgreSQL 10.4
```

```
apache or IIS
```

### Installing

Clone the repo to a folder under your web server and use npm to install it.

```
npm install
```

Find the SQL script in the repo and run it to create a table and populate that table with some default values.  If you skip this step or a connection to your postgres instance fails, the dataServices fall back to return static sample data.
