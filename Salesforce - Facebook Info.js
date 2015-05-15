{!REQUIRESCRIPT("/soap/ajax/33.0/connection.js")}
{!REQUIRESCRIPT("//code.jquery.com/jquery-2.1.4.min.js")}

jQuery.ajax = (function(_ajax) {

    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol) ? 's' : '') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';

    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }

    return function(o) {

        var url = o.url;

        if (/get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url)) {

            // Manipulate options so that JSONP-x request is made to YQL

            o.url = YQL;
            o.dataType = 'json';

            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data) : '')
                ),
                format: 'xml'
            };

            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }

            o.success = (function(_success) {
                return function(data) {

                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }

                };
            })(o.success);

        }

        return _ajax.apply(this, arguments);

    };

})(jQuery.ajax);
var records = {!GETRECORDIDS($ObjectType.Lead)};

var newRecords = [];
var content = '';

if (records.length < 1) {
    alert("Por favor selecione algum lead");
} else {
    var r = confirm("Clique ''OK'' para buscar as informações no Facebook");
    if (r == true) {
        try {
            var leads = sforce.connection.retrieve("Id,Website,Quantidade_fas_seguidores__c,Description", "Lead", records);

            var cLeads = records.length;
            for (var n = 0; n < cLeads; n++) {
                var leadObj = leads[n];
                var url = leadObj.Website;
console.log(leadObj.Quantidade_fas_seguidores__c);
console.log(leadObj.Description);
                var fanBase = leadObj.Quantidade_fas_seguidores__c;

                jQuery.ajax({
                    url: url,
                    type: 'GET',
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:11.0) Gecko/20100101 Firefox/11.0"
                    },
                    success: function(html) {
                        content = html;
                        var fanPageUrl = content.responseText.match(/href="[^f]*(facebook.com\/[^\"]*)/);
                        var token = '?access_token=CAADqGJ3Nqn0BAHYelBfvghhQpdNoivZBxfolGk2wYLxFZAYFGdxv6enPuAhryJAIejiPNca5VCJ6pDKkUcos3PD97fG09K8wHkCAj8KoOma9XM98dSGsIsR2QUxUZCn5U3SAqiX22oMCEQIFoEuzGiATexZAZCDY0NbbLLCoEGNsJXloT98LPXd0wW3I4XYpNpHcVJUEihZBBNGmqzt3qH&expires=5184000'

                        if (fanPageUrl !== null && fanPageUrl != 'pages') {
                            var urlsplit = fanPageUrl[1].split('/')
                            var fanPageId = urlsplit[urlsplit.length - 1];

                            // Pega o número de likes e telefone

                            var pageFacebook = 'https://graph.facebook.com/' + fanPageId + token;
                            console.log(pageFacebook);
                            jQuery.ajax({
                                url: pageFacebook,
                                type: 'GET',
                                dataType: "jsonp",
                                headers: {
                                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:11.0) Gecko/20100101 Firefox/11.0"
                                },

                                success: function(data) {
                                    
                                  //  data = JSON.parse(pageFacebook.responseText);
                                    var likes = data.likes;
                                    console.log(likes, data);
                                    var phone = data.phone;
                                    //leadObj.Quantidade_fas_seguidores__c = likes;
                                    if (likes >= 0 && likes < 1000) {
                                        leadObj.Quantidade_fas_seguidores__c = "0 - 1000"
                                    }; else if (likes >= 1000 && likes < 10000) {
                                        leadObj.Quantidade_fas_seguidores__c = "1.000 - 10.000"
                                    }; else if (likes >= 10000 && likes < 100000) {
                                        leadObj.Quantidade_fas_seguidores__c = "10.000 - 100.000"
                                    }; else if (likes >= 100000 && likes < 500000) {
                                        leadObj.Quantidade_fas_seguidores__c = "100.000 - 500.000"
                                    }; else if ( likes >= 500000 && likes < 1000000) {
                                        leadObj.Quantidade_fas_seguidores__c = "500.000 - 1.000.000"
                                    }; else if (likes >= 1000000) {
                                        leadObj.Quantidade_fas_seguidores__c = "Mais que 1.000.000"
                                    };
                                    console.log(leadObj.Quantidade_fas_seguidores__c);
                                    if (leadObj.Phone == '') {
                                        leadObj.Phone = phone
                                    };
                                    finishHim();

                                },
                                error: function(err) {
                                    alert("Deu erro.");
                                    console.log(err);
                                },

                            });


                        }
                    },
                });

            };


            // if (result[0].getBoolean("success")) {
            //     alert("Lead " + result[0].Name + " atualizado");
            // } else {
            //     alert("Falha em atualizar o lead " + result[0]);
            // }

    } catch (e) {
        alert(e);
    }
    }
}
var count = 0;
console.log("OI")
function finishHim() {
    count++;
console.log(count, cLeads, "logando")
    if (count == cLeads) {
        result = sforce.connection.update(leads);
        console.log(count, result);
        window.location.reload();
    }
}