{!REQUIRESCRIPT("/soap/ajax/33.0/connection.js")} 
{!REQUIRESCRIPT("//code.jquery.com/jquery-2.1.4.min.js")}
{!REQUIRESCRIPT("//raw.githubusercontent.com/jashkenas/underscore/master/underscore.js")}

var recordsLeads = {!GETRECORDIDS($ObjectType.Lead)};
var recordsContacts = {!GETRECORDIDS($ObjectType.Contact)}
var newRecords = [];




if (recordsLeads.length < 1) {
    alert("Por favor selecione algum lead");
} else {
    var r = confirm("Clique ''OK'' para para desqualificar os leads que já são clientes");
	if (r) {
		        var leads = sforce.connection.retrieve("Id,domain__c", "Lead", recordsLeads);
		        var contacts = sforce.connection.query("select Id, domain__c from Contact where domain__c != null");
		        console.log(contacts)
		        console.log(contacts[2300])
		        var uniqueDomains = [];
		        //for ( var a = 0; )
				//$.each(contacts, function(i, el){
    			//if($.inArray(el, uniqueDomains) === -1) uniqueDomains.push(el);
    			//console.log(uniqueDomains)
//});
	}
};







// Codigo para conversão do lead
/*var account = new sforce.SObject("Account");
account.Name = "convert lead sample";
account.Phone = "2837484894";
result = sforce.connection.create([account]);
account.Id = result[0].id;

var lead = new sforce.SObject("Lead");
lead.Country = "US";
lead.Description = "This is a description";
lead.Email = "someone@somewhere.com";
lead.FirstName = "first";
lead.LastName = "last";
lead.Company = account.Name;
result = sforce.connection.create([lead]);
lead.Id = result[0].id;

var convert = new sforce.LeadConvert();
convert.accountId = account.Id;
convert.leadId = lead.Id;
convert.convertedStatus = "Qualified";

result = sforce.connection.convertLead([convert]);
if (result[0].getBoolean("success")) {
  log("lead converted " + result[0]);
} else {
  log("lead convert failed " + result[0]);
}*/