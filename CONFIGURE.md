# Configure the Palantir

The Palantir is by default an "empty shell". It means, if you start the Palantir as is, without any configuration, it will result by a blank website, without any menu or content.

The base idea of the configuration is to create your website populated by apps you want to use and customize. You can, for example, define a documentation reader app and create a menu to display it. Or can create a dashboard to display some metrics and refresh them by a repeating task.

---

## The palantir.json file

The entire Palantir configuration is defined in a single JSON file: the palantir.json. When you open the website, it automatically loads this file. Depending on [your installation](./USE.md), this file can be located anywhere you want.

### The variables

```json
{
  "variables": {
    "a-variable": "its value"
  }
}
```

To keep things clear and to avoid duplicates in your configuration file, you can delare custom variables by a name with its value. You can use them in the entire JSON file with the format `#{name}`.

An example with a Github token:



```json
{
  "variables": {
    "hithub-token": "1234"
  },
  "apps": {
    "my-github-app": {
      "type": "github-pulls",
      "config": {
        "token": "#{github-token}",
        ...
      }
    }
  }
}
```

#### The protected variables

Some variables names are already used by the apps and some others by the Palantir itself. You can't use them for any other purpose. Consult the [apps documentation](./APPS.md) to discover their. Here are the list of the Palantir ones:

| Variable | Default value | Description |
| -- | -- | -- |
| `upgrade.button` (boolean) | true | This enables the upgrade notification button located on the top right of the screen. |
| `upgrade.reload` (boolean) | true | This enables the upgrade check made every 12 hours. It calls the server that calls the actual Github project version. |


### The apps

#### A task

### The menus
