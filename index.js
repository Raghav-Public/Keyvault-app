var http = require('http'); 
var KeyVault = require('azure-keyvault');
var msRestAzure = require("ms-rest-azure");

var VAULT_URL = 'https://vault.azure.net';
var KEY_VAULT_URI = 'https://rd-key-vault.vault.azure.net';
var SECRET_NAME = "simple-key";


var getKeyVaultCredentials = function(){
    return msRestAzure.loginWithAppServiceMSI({resource: ''});
}

function getKeyVaultSecret(credentials) {
    let keyVaultClient = new KeyVault.KeyVaultClient(credentials);
    return keyVaultClient.getSecret(KEY_VAULT_URI, SECRET_NAME, "");
}

var port = process.env.PORT || 9090;

http.createServer(function(req, res) {
    getKeyVaultCredentials().then(
        getKeyVaultSecret
    ).then(function(secret) {
        res.write(secret);
        res.end();
    }).catch(function(err) {
        console.log(err);
        res.write(err);
        res.end();
    })
}).listen(port);


console.log("Server running at http://localhost:%d", port);