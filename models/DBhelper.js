var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var LocationSchema = new Schema({
	_id: ObjectId,
	url: String,
	location: String,
	date: Date
});

mongoose.model('LocationModel', LocationSchema);

var LocationModel = mongoose.model('LocationModel');

function setGeoData(url, location){
	mongoose.connect('mongodb://localhost/geo_data');
	console.log('saving here');
	var locationModel = new LocationModel();
	locationModel.url = url;
	locationModel.location = location;
	locationModel.save(function(err){
		if(!err) {
			console.log('Saved url: ' + url + 'location: ' + location);
		} 
		else { 
			console.log('Error saving url: ' + url + 'location ' + location);
		}

	});	
}


function getGeoData(url, res){
	mongoose.connect('mongodb://localhost/geo_data');
	console.log('getting here');
	
	LocationModel.findOne({'url':url}, function(err, doc){
		if(!err) {
			console.log('found url: ' + url); 
			console.log(doc.url);			
			console.log(doc.location);
			res.send(doc.location);
		}
		else {
		console.log('Error getting url: ' + url);
		res.send("not found");
		}
	});	
}

function getGeoDataJson(url, res){
	mongoose.connect('mongodb://localhost/geo_data');
	console.log('getting here');
	
	LocationModel.findOne({'url':url}, function(err, doc){
		if(!err) {
			console.log('found url: ' + url); 
			console.log(doc.url);			
			console.log(doc.location);
			res.send(doc.location);
		}
		else {
		console.log('Error getting url: ' + url);
		res.send("not found");
		}
	});	
}

function getAllData(res){
    mongoose.connect('mongodb://localhost/geo_data');
    console.log('getting here');
    LocationModel.find({}, function(err, docs){
        var resstr = '<table border="1">';
        for (var doc in docs) {
	    console.log("docs[doc].ur=" + docs[doc].url);
	     if(docs[doc].url !== 'undefined'){
	            resstr += '<tr><td>' + docs[doc].url + '</td><td>' + docs[doc].location + '</td></tr>';
	     }
        }
        resstr += '</table>';
        res.send(resstr);
    });
}

function getAdminConsole(res){
    mongoose.connect('mongodb://localhost/geo_data');
    console.log('getting admin console here');
    LocationModel.find({}, function(err, docs){        
	  var tempObj = {};
	  var tempArr = [];
        for (var doc in docs) {           
		if(docs[doc].url != 'undefined'){
			tempObj[docs[doc].url] = true;	
		}	
        }        
	for(var eachObj in tempObj){
		tempArr.push(eachObj);
	}
        res.render('adminconsole.ejs',{
		layout: false,
		locals: {tempArr: tempArr}		
	});
    });
}

exports.setGeoData = setGeoData;
exports.getGeoData = getGeoData;
exports.getAllData = getAllData;
exports.getAdminConsole = getAdminConsole;
