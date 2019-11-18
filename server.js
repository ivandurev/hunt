'use strict';
var express = require('express');
var http = require('http');  
var https = require('https');  
var bodyParser = require('body-parser');
var mysql = require('mysql');
var crypto = require('crypto');
//var HTTP_redirect = require('./HTTP_redirect');
var path = require('path');
var fs = require('fs');
var helmet = require('helmet');
var fileUpload = require('express-fileupload');
//const readline = require('readline');
var app = express();
app.use(helmet());
app.use(helmet.noCache());
var currDB = mysql.createConnection({
	host: "localhost",
	user: "hackapp",
	password: "weregonnawin",
	database: "hunt",
	port: 4288
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
}));

app.enable('trust proxy');

app.use('/', express.static(__dirname + '/riddle_resources'));
app.get('/testPage.html', function(req, res)
{
	res.sendFile(path.join(__dirname, 'testPage.html'));
});

app.get('/styleTest.css', function(req, res)
{
	res.sendFile(path.join(__dirname, 'styleTest.css'));
});
app.get('/allGames.html', function(req, res)
{
	res.sendFile(path.join(__dirname, 'allGames.html'));
});
app.get('/bootstrap.min.css', function(req, res)
{
	res.sendFile(path.join(__dirname, 'bootstrap.min.css'));
});
app.get('/joinGame.html', function(req, res)
{
	res.sendFile(path.join(__dirname, 'joinGame.html'));
});
app.get('/loginpage.html', function(req, res)
{
	res.sendFile(path.join(__dirname, 'loginpage.html'));
});
app.get('/newGame.html', function(req, res)
{
	res.sendFile(path.join(__dirname, 'newGame.html'));
});
app.get('/currentGame.html', function(req, res)
{
	res.sendFile(path.join(__dirname, 'currentGame.html'));
});

app.get('/register.html', function(req, res)
{
	res.sendFile(path.join(__dirname, 'register.html'));
});
app.get('/index.html', function(req, res)
{
	res.sendFile(path.join(__dirname, 'loginpage.html'));
});
app.get('/index.htm', function(req, res)
{
	res.sendFile(path.join(__dirname, 'loginpage.html'));
});
app.get('/', function(req, res)
{
	res.sendFile(path.join(__dirname, 'loginpage.html'));
});
app.get('/index.js', function(req, res)
{
	res.sendFile(path.join(__dirname, 'index.js'));
});
app.get('/jquery.min.js', function(req, res)
{
	res.sendFile(path.join(__dirname, 'jquery.min.js'));
});


var user = [];
var ul = 0;
var token = [];

var check = function(str)
{
	var letters = /^[0-9a-zA-Zа-яА-Я]+$/;
	if(str.match(letters)) return 1;
	return 0;
}
var genToken = function()
{
	return genRandomString(20);
}

var genRandomString = function(length)
{
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex') .slice(0,length); 
};
var sha256 = function(password, salt)
{
    var hash = crypto.createHmac('sha256', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function register(user, pass)
{
    var salt = genRandomString(16);
    var password = sha256(pass, salt);
    currDB.query("INSERT INTO users (username, points, salt, password, gameID) VALUES ('"+user+"', 0,'"+salt+"','"+password.passwordHash+"', -1)", function(err, rows)
    {
    	if(err) throw err;
    });
    console.log(user + " registered")
    return salt;
}
app.post('/register', function(req, res)
{
	if(req.body.token != undefined && req.body.user != undefined && req.body.pass != undefined && check(req.body.token) && check(req.body.user) && check(req.body.pass))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined) return;
		if(req.body.user.length > 30)
		{
			res.send({ok:0});
			return;
		}
		currDB.query("SELECT * FROM users WHERE username='"+req.body.user+"'", function(err, rows)
		{
			if(err) throw err;
			if(rows.length == 0)
			{
				// populate user[token[tk]]
				var slt = register(req.body.user, req.body.pass);

				currDB.query("SELECT * FROM users WHERE username='"+req.body.user+"' AND password='"+sha256(req.body.pass, slt).passwordHash+"'", function(err, rows)
				{
					//console.log(rows);
					if(err) throw err;
					if(rows.length == 0)
					{
						res.send({ok:0});
						return;
					}
					console.log(rows[0]['username'] + ' registered and has id: ' + rows[0].id);
					//populate user[token[tk]]
					user[tk] = {token: req.body.token, id: rows[0].id}
					res.send({ok:1});
				});
			}
			else res.send({ok:0});
		});
	}
	else res.send({ok:0});
});
app.post('/getGames', function(req, res)
{
	console.log(req.body);
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		console.log(user[tk].id);
		currDB.query("SELECT gameID, type FROM current WHERE userID=" + user[tk].id, function(err, rows)
		{
			if(err) throw err;
			res.send(rows);
		});
	}
});
app.post('/joinPublicGame', function(req, res) // to join any game with userID == -1
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT id FROM games WHERE userID=-1", function(err, rows)
		{	
			if(err) throw err;
			if(rows.length == 0)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[Math.floor(Math.random() * rows.length)].id;
			currDB.query("INSERT INTO current (gameID, userID, type) VALUES ("+GID+','+user[tk].id+',2);', function(err, rows)
			{
				if(err) throw err;
				console.log('user '+user[tk].id+' joined game '+GID);
				res.send({ok: 1});
			});
		});
	}
});
app.post('/joinGame', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token) && req.body.gameID != undefined && check(req.body.gameID))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM pending WHERE userID=" + user[tk].id + " AND gameID=" + req.body.gameID, function(err, rows)
		{
			if(err) throw err;
			if(rows.length == 0)
			{
				currDB.query("SELECT gameID FROM current WHERE userID=" + user[tk].id + " AND gameID=" + req.body.gameID, function(err, rows)
				{
					if(rows.length == 0)
					{
						currDB.query("SELECT id, userID, en FROM games WHERE id="+req.body.gameID, function(err, rows)
						{
							if(rows.length != 0)
							{
								if(rows[0].en != 1)
								{
									res.send({ok: 0}); // cannot join
									return;
								}
								if(rows[0].userID != -1)
								{
									currDB.query("INSERT INTO pending (gameID, userID, denied) VALUES ("+req.body.gameID+','+user[tk].id+',0);', function(err, rows)
									{
										if(err) throw err;
										console.log('user '+user[tk].id+' joined game '+req.body.gameID);
										res.send({ok: 1});
									});
								}
								else
								{
									/*currDB.query("INSERT INTO current (gameID, userID, type) VALUES ("+req.body.gameID+','+user[tk].id+',2);', function(err, rows)
									{
										if(err) throw err;
										console.log('user '+user[tk].id+' joined game '+req.body.gameID);
										res.send({ok: 2});
									});	*/
									res.send({ok: 0}); // cannot join
								}
							}
							else res.send({ok: -1}); // there is no such game
						});
						
					}
					else res.send({ok: -2}); // already joined
				});
			}
			else res.send({ok: -3}); // already requested
		});
	}
});
app.post('/createRiddle', function(req, res)
{
	//console.log(req.body);
	if(req.body.token != undefined && check(req.body.token) && 
	   req.body.loc1 != undefined && check(req.body.loc1) && 
	   req.body.loc2 != undefined && check(req.body.loc2) && 
	   req.body.riddle != undefined && 
	   req.body.hint != undefined)
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		var l1 = String(parseInt(req.body.loc1));
		var l2 = String(parseInt(req.body.loc2));
		
		currDB.query("INSERT INTO riddles (loc_1, loc_2, riddle, hint, userID) VALUES ("+l1+","+l2+",'"+req.body.riddle+"','"+req.body.hint+"',"+user[tk].id+')', function(err, rows)
		{
			if(err) throw err;
			console.log("INSERT INTO riddles (loc_1, loc_2, riddle, hint, userID) VALUES ("+l1+","+l2+",'"+req.body.riddle+"','"+req.body.hint+"',"+user[tk].id+')');
			res.send({ok:1});
		});
	}
});

function validateSeq(data)
{
	currDB.query("SELECT id FROM riddles WHERE id="+data, function(err, rows)
	{
		if(err) throw err;
		console.log(rows.length);
		return rows.length;
	});
}
app.post('/createGame', function(req, res)
{
	console.log(req.body);
	if(req.body.token != undefined && check(req.body.token) && 
	   req.body.riddles != undefined && 
	   req.body.flags != undefined && check(req.body.flags))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		if(typeof(req.body.riddles) != "string") return;
		var curr = "";

		for(var i = 0; i < req.body.riddles.length; i ++)
		{
			if(req.body.riddles[i] == '_')
			{
				console.log("Checking "+curr);
				if(validateSeq(parseInt(curr)) == 0) return;
				curr = "";
			}
			else if (req.body.riddles[i] >= '0' && req.body.riddles[i] <= '9') curr += req.body.riddles[i];
			else return;
		}
		if(req.body.flags.length > 2) return; //change if more flags
		currDB.query("INSERT INTO games (riddles, userID, flags, en) VALUES ('"+req.body.riddles+"',"+user[tk].id+",'"+req.body.flags+"', 0);", function (err, rows)
		{
			if(err) throw err;
			currDB.query("SELECT id FROM games WHERE userID="+user[tk].id+" AND riddles='"+req.body.riddles+"'", function(err, rows)
			{
				if(err) throw err;
				res.send({ok:1, id: rows[rows.length-1].id}); // returns array of riddlesrtrings
			});
		});
	}
});

// functions for admins of games!!!!
app.post('/getRiddle', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token) && req.body.riddleID != undefined && check(req.body.riddleID))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT id, loc_1, loc_2, riddle, hint FROM riddles WHERE userID="+user[tk].id+" AND id="+req.body.riddleID, function(err, rows)
		{
			if(err) throw err;
			if(rows.length == 0)
			{
				res.send({id: -1});
				return;
			}
			res.send(rows[0]);
		});
	}
});
app.post('/getRiddles', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT id, loc_1, loc_2, riddle, hint FROM riddles WHERE userID="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows.length == 0)
			{
				res.send({ok: 0});
				return;
			}
			res.send(rows);
		});
	}
});
app.post('/getUsername', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT username FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			res.send({user: rows[0].username});
		});
	}
});
app.post('/getMyCreatedGames', function(req, res) // get created games
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT id, riddles FROM games WHERE userID="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			res.send(rows); // returns array of riddlesrtrings
		});
	}
}); 
app.post('/hostGame', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token) && req.body.gameID != undefined && check(req.body.gameID))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT id, en FROM games WHERE userID="+user[tk].id+" AND id="+req.body.gameID, function(err, rows)
		{
			if(rows.length == 0 || rows[0].en == 1)
			{
				res.send({ok: 0});
				return;
			}
			// enable game and user joins
			currDB.query("UPDATE games SET en=1 WHERE id="+req.body.gameID, function(err, rows)
			{
				currDB.query("INSERT INTO current (gameID, userID, type) VALUES ("+req.body.gameID+','+user[tk].id+',0);', function(err, rows)
				{
					if(err) throw err;
					console.log('user '+user[tk].id+' hosts game '+req.body.gameID);
					res.send({ok: 1});
				});
			});
			currDB.query("UPDATE users SET gameID="+req.body.gameID+" WHERE id="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
			});
		});
	}
});
app.post('/getRequests', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID; 
			currDB.query("SELECT type FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
				if(rows.length == 0 || rows[0].type != 0)
				{
					res.send({ok:0});
					return;
				}
				currDB.query("SELECT userID FROM pending WHERE gameID="+GID, function(err, rows)
				{
					if(err) throw err;
					if(rows.length == 0)
					{
						res.send([]);
						return;
					}
					var resp = "";
					for(var i = 0; i < rows.length; i ++)
					{
						resp += rows[i].userID;
						if(i != rows.length-1)
						{
							resp += ',';
						}
					}
					currDB.query("SELECT username FROM users WHERE id IN ("+resp+')', function(err, rows)
					{
						if(err) throw err;
						var ret = [];
						for(var i = 0; i < rows.length; i ++)
						{
							ret[ret.length] = (rows[i].username);
						}
						res.send(ret);
					});
				});
			});
		});
	}
	
});
app.post('/allowUser', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token) && req.body.username != undefined && check(req.body.username))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT type FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
				if(rows.length == 0)
				{
					res.send({ok:0});
					return;
				}
				if(rows[0].type != 0)
				{
					res.send({ok:0});
					return;
				}
				currDB.query("SELECT id FROM users WHERE username='"+req.body.username+"'", function(err, rows)
				{
					if(err) throw err;
					if(rows.length == 0)
					{
						res.send({ok:0});
						return;
					}
					var UID = rows[0].id;
					currDB.query("SELECT denied FROM pending WHERE userID="+UID+" AND gameID="+GID, function(err, rows)
					{
						if(err) throw err;
						if(rows.length == 0)
						{
							res.send({ok: 0});
						}
						currDB.query("INSERT INTO current (userID, gameID, `type`, `on`) VALUES ("+UID+","+GID+",2,0)", function(err, rows)
						{
							if(err) throw err;
							currDB.query("DELETE FROM pending WHERE userID="+UID+" AND gameID="+GID, function(err, rows)
							{
								if(err) throw err;
								console.log(req.body.username+" allowed on "+GID);
								res.send({ok:1});
							});
						});
					});
				});
			});
		});
	}
});
app.post('/denyUser', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token) && req.body.username != undefined && check(req.body.username))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT type FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
				if(rows.length == 0)
				{
					res.send({ok:0});
					return;
				}
				if(rows[0].type != 0)
				{
					res.send({ok:0});
					return;
				}
				currDB.query("SELECT id FROM users WHERE username='"+req.body.username+"'", function(err, rows)
				{
					if(err) throw err;
					if(rows.length == 0)
					{
						res.send({ok:0});
						return;
					}
					var UID = rows[0].id;
					currDB.query("SELECT denied FROM pending WHERE userID="+UID+" AND gameID="+GID, function(err, rows)
					{
						if(err) throw err;
						if(rows.length == 0)
						{
							res.send({ok: 0});
						}
						currDB.query("UPDATE pending SET denied=1 WHERE userID="+UID+" AND gameID="+GID, function(err, rows)
						{
							if(err) throw err;
							res.send({ok:1});
						});
					});
				});
			});
		});
	}
});
app.post('/removeUser', function(req, res) // from the same game (only admins can do that and only for their own games)
{
	if(req.body.token != undefined && check(req.body.token) && req.body.username != undefined && check(req.body.username))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT type FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
				if(rows.length == 0)
				{
					res.send({ok:0});
					return;
				}
				if(rows[0].type != 0)
				{
					res.send({ok:0});
					return;
				}
				currDB.query("SELECT id FROM users WHERE username='"+req.body.username+"'", function(err, rows)
				{
					if(err) throw err;
					if(rows.length == 0)
					{
						res.send({ok:0});
						return;
					}
					var UID = rows[0].id;
					currDB.query("DELETE FROM current WHERE userID="+UID+" AND gameID="+GID, function(err, rows)
					{
						if(err) throw err;
						currDB.query("SELECT gameID FROM users WHERE id="+UID, function(err, rows)
						{
							if(err) throw err;
							//console.log(rows);
							if(rows[0].gameID == GID)
							{
								currDB.query("UPDATE users SET gameID=-1 WHERE id="+UID, function(err, rows)
								{
									if(err) throw err;
								});
							}
							res.send({ok:1});
						});
					});
				});
			});
		});
	}
});
app.post('/getUsers', function(req, res) // in same game
{

});
app.post('/getStatus', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT status FROM reviews WHERE userID="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows.length == 0)
			{
				res.send({status: -1});
				return;
			}
			res.send({status: rows[0].status});
		});
	}
});


app.post('/getGameStats', function(req, res) 
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT `type` FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
				if(rows.length == 0)
				{
					res.send({ok:0});
					return;
				}
				if(rows[0].type != 0)
				{
					res.send({ok:0});
					return;
				}
				currDB.query("SELECT userID, `type`, `on` FROM current WHERE gameID="+GID, function(err, rows)
				{
					if(err) throw err;
					if(rows.length == 0)
					{
						res.send([]);
						return;
					}
					var ret = rows.slice();
					//console.log(ret);
					var resp = "";
					for(var i = 0; i < rows.length; i ++)
					{
						resp += rows[i].userID;
						if(i != rows.length-1)
						{
							resp += ',';
						}
					}
					var names = [];
					currDB.query("SELECT id, username FROM users WHERE id IN ("+resp+')', function(err, rows)
					{
						if(err) throw err;
						for(var i = 0; i < rows.length; i ++)
						{
							names[rows[i].id] = rows[i].username;
						}
						for(var i = 0; i < ret.length; i ++)
						{
							console.log("username for "+ret[i].userID+" is "+names[ret[i].userID]);
							ret[i].username = names[ret[i].userID];
							ret[i].userID = undefined;
						}
						res.send(ret);
					});
				});
			});
		});
	}
});
app.post('/setPrivilege', function(req, res) // sets the privilleges for
{
	if(req.body.token != undefined && check(req.body.token) && req.body.username != undefined && check(req.body.username) && req.body.type != undefined && check(req.body.type))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		if(req.body.type != 1 && req.body.type != 2) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT type FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
				if(rows.length == 0)
				{
					res.send({ok:0});
					return;
				}
				if(rows[0].type != 0)
				{
					res.send({ok:0});
					return;
				}
				currDB.query("SELECT id FROM users WHERE username='"+req.body.username+"'", function(err, rows)
				{
					if(err) throw err;
					if(rows.length == 0)
					{
						res.send({ok:0});
						return;
					}
					var UID = rows[0].id;
					currDB.query("UPDATE current SET type="+req.body.type+" WHERE userID="+UID+" AND gameID="+GID, function(err, rows)
					{
						if(err) throw err;
						res.send({ok:1});
					});
				});
			});
		});
	}
});
app.post('/setReview', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token) && req.body.username != undefined && check(req.body.username) && req.body.complete != undefined && check(req.body.complete))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT type FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
				if(rows.length == 0)
				{
					res.send({ok:0});
					return;
				}
				if(rows[0].type != 0 && rows[0].type != 1)
				{
					res.send({ok:0});
					return;
				}
				currDB.query("SELECT id FROM users WHERE username='"+req.body.username+"'", function(err, rows)
				{
					if(err) throw err;
					if(rows.length == 0)
					{
						res.send({ok:0});
						return;
					}
					var UID = rows[0].id;
					if(req.body.complete == 1)
					{
						currDB.query("UPDATE current SET `on`=`on`+1 WHERE userID="+UID+" AND gameID="+GID, function(err, rows)
						{
							if(err) throw err;
							res.send({ok:1});
							currDB.query("DELETE FROM reviews WHERE userID="+UID, function(err, rows)
							{
								if(err) throw errr;
							});
						});
					}
					if(req.body.complete == 0)
					{
						res.send({ok:1});
						currDB.query("REPLACE INTO reviews (`status`, userID, gameID) VALUES (-2,"+UID+","+GID+")", function(err, rows)
						{
							if(err) throw errr;
						});
					}
				});
			});
		});
	}
}); //
app.post('/getPendingReviews', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT type FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
				if(rows.length == 0)
				{
					res.send({ok:0});
					return;
				}
				if(rows[0].type != 0 && rows[0].type != 1)
				{
					res.send({ok:0});
					return;
				}
				currDB.query("SELECT imgURL, userID FROM reviews WHERE status=1 AND gameID="+GID, function(err, rows)
				{
					if(err) throw err;
					if(rows.length == 0)
					{
						res.send([]);
						return;
					}
					var ret = rows;
					var resp = "";
					for(var i = 0; i < rows.length; i ++)
					{
						resp += rows[i].userID;
						if(i != rows.length-1)
						{
							resp += ',';
						}
					}
					currDB.query("SELECT id, username FROM users WHERE id IN ("+resp+")", function(err, rows)
					{
						var name = [];
						for(var i = 0; i < rows.length; i ++)
						{
							name[rows[i].id] = rows[i].username;
						}
						for(var i = 0; i < ret.length; i ++)
						{
							ret[i].username = name[ret[i].userID];
							ret[i].userID = undefined;
						}
						res.send(ret);
					});
				});
			});
		});
	}
});
// -------------------------------------------------------

app.post('/changeGame', function(req, res) // change current game
{
	if(req.body.token != undefined && check(req.body.token) && req.body.ngame != undefined && check(req.body.ngame))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT id FROM current WHERE userID="+user[tk].id+" AND gameID="+req.body.ngame, function(err, rows)
		{
			if(err) throw err;
			if(rows.length == 0)
			{
				res.send({ok:0});
				return;
			}
			currDB.query("UPDATE users SET gameID="+req.body.ngame+" WHERE id="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
				res.send({ok: 1});
			});
			currDB.query("DELETE FROM reviews WHERE userID="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
			});
			
		});
	}
});
function checkLOC(tr1, tr2, user1, user2)
{
	console.log(tr1+" "+tr2+" "+user1+" "+user2);
	tr1 /= 1000000.; 
	tr2 /= 1000000.;
	user1 /= 1000000.;
	user2 /= 1000000.;
	var R = 6371e3; // metres
	var phi1 = tr1*Math.PI/180.;
	var phi2 = user1*Math.PI/180.;
	var delta_phi = (user1-tr1)*Math.PI/180.;
	var delta_lambda = (user2-tr2)*Math.PI/180.;

	var a = Math.sin(delta_phi/2) * Math.sin(delta_phi/2) +
	        Math.cos(phi1) * Math.cos(phi2) *
	        Math.sin(delta_lambda/2) * Math.sin(delta_lambda/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c;
	return d<10;
}
app.post('/checkLocation', function(req, res)
{
	console.log(req.body);
	if(req.body.token != undefined && check(req.body.token) && req.body.loc1 != undefined && req.body.loc2 != undefined)
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT riddles FROM games WHERE id="+rows[0].gameID, function(err, rows)
			{
				if(err) throw err;
				var RID = rows[0].riddles;
				currDB.query("SELECT type, `on` FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
				{
					if(err) throw err;
					if(rows[0].type != 2)
					{
						res.send({ok: -1});
						return;
					}
					var curr = "";
					var rem = rows[0].on;
					for(var i = 0; i < RID.length; i ++)
					{
						if(RID[i] == '_' && rem > 0)
						{
							rem --;
						}
						else if(rem == 0)
						{
							curr += RID[i];
						}
						else if(rem == 0 && RID[i] == '_')
						{
							break;
						}
					}
					curr = parseInt(curr);
					currDB.query("SELECT loc_1, loc_2 FROM riddles WHERE id="+curr, function(err, rows)
					{
						if(err) throw err;
						if(checkLOC(rows[0].loc_1, rows[0].loc_2, req.body.loc1, req.body.loc2))
						{
							// tell them to stop checking the location and upload a picture instead
							currDB.query("SELECT userID FROM games WHERE id="+GID, function(err, rows)
							{
								if(err) throw err;
								if(rows[0].userID == -1)
								{
									currDB.query("UPDATE current SET `on`=`on`+1 WHERE gameID="+GID+" AND userID="+user[tk].id);
									res.send({ok:2});
									return;
								}
								currDB.query("REPLACE INTO reviews (`status`, userID, gameID) VALUES (0, "+user[tk].id+","+GID+")", function(err, rows)
								{
									if(err) throw err;
									res.send({ok:1});
								});
							});
							
						}
						else
						{
							currDB.query("REPLACE INTO reviews (`status`, userID, gameID) VALUES (-1, "+user[tk].id+","+GID+")", function(err, rows)
							{
								if(err) throw err;
								res.send({ok:0});
							});
						}

					});
				});
			});
		});
	}
});
app.post('/getHint', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT riddles FROM games WHERE id="+rows[0].gameID, function(err, rows)
			{
				if(err) throw err;
				var RID = rows[0].riddles;
				currDB.query("SELECT type, `on` FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
				{
					if(err) throw err;
					if(rows[0].type != 2)
					{
						res.send({ok:0});
						return;
					}
					var ONNN = rows[0].on;
					var curr = "";
					var rem = rows[0].on;
					for(var i = 0; i < RID.length; i ++)
					{
						if(RID[i] == '_' && rem > 0)
						{
							rem --;
						}
						else if(rem == 0)
						{
							curr += RID[i];
						}
						else if(rem == 0 && RID[i] == '_')
						{
							break;
						}
					}
					if(curr.length == 0)
					{
						res.send({hint: "You completed the game!!!"});
						return;
					}
					curr = parseInt(curr);
					currDB.query("SELECT hint FROM riddles WHERE id="+curr, function(err, rows)
					{
						if(err) throw err;
						res.send({hint: rows[0].hint});
					});
				});
			});
		});
	}
});
app.post('/uploadPicture', function(req, res)
{
	//console.log(req.files);
	if(req.body.token != undefined && check(req.body.token) && req.files != undefined && req.files.file != undefined)
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT type FROM current WHERE userID="+user[tk].id+" AND gameID="+GID, function(err, rows)
			{
				if(err) throw err;
				if(rows.length == 0)
				{
					res.send({ok:0});
					return;
				}
				if(rows[0].type == 0)
				{
					req.files.file.mv('riddle_resources/'+req.files.file.name, function(err)
					{
						if (err)
  							return res.status(500).send(err);
  						console.log("Uploaded file!");
						res.send({ok:1});
					});
				}
				if(rows[0].type == 2)
				{
					// zapazvash snimkata v pending reviews
					currDB.query("SELECT status FROM reviews WHERE userID="+user[tk].id, function(err, rows)
					{
						if(err) throw err;
						if(rows.length == 0 || rows[0].status != 0)
						{
							res.send({ok:0});
							return;
						}
						var fname = user[tk].id + genRandomString(10) + path.extname(req.files.file.name);
						console.log(fname);
						req.files.file.mv('pending_reviews/'+fname, function(err)
						{
    						if (err)
      							return res.status(500).send(err);
      						console.log("Uploaded file!");
    						res.send({ok:1});

							currDB.query("REPLACE INTO reviews (`status`,imgURL,userID,gameID) VALUES (1,'"+fname+"',"+user[tk].id+","+GID+")", function(err, rows)
							{
								if(err) throw err;
							});

							app.get('/'+fname, function(req, res)
							{
								res.sendFile(path.join(__dirname, 'pending_reviews/'+fname));
							});
  						});
					});
				}
			});
				
		});
	}
});
app.post('/getMyStats', function(req, res) 
{

});
app.post('/getCurrRiddle', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({ok:0});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT riddles FROM games WHERE id="+rows[0].gameID, function(err, rows)
			{
				if(err) throw err;
				var RID = rows[0].riddles;
				currDB.query("SELECT type, `on` FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
				{
					if(err) throw err;
					if(rows[0].type != 2)
					{
						res.send({ok:0});
						return;
					}
					var ONNN = rows[0].on;
					var curr = "";
					var rem = rows[0].on;
					for(var i = 0; i < RID.length; i ++)
					{
						if(RID[i] == '_' && rem > 0)
						{
							rem --;
						}
						else if(rem == 0)
						{
							curr += RID[i];
						}
						else if(rem == 0 && RID[i] == '_')
						{
							break;
						}
					}
					if(curr.length == 0)
					{
						res.send({content: "You completed the game!!!", gameID: GID, on: ONNN});
						return;
					}
					curr = parseInt(curr);
					currDB.query("SELECT riddle FROM riddles WHERE id="+curr, function(err, rows)
					{
						if(err) throw err;
						res.send({content: rows[0].riddle, gameID: GID, on: ONNN});
					});
				});
			});
		});
	}
});
app.post('/getUserType', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined || user[tk] == undefined || user[tk].id == undefined || user[tk].id == -1) return;
		currDB.query("SELECT gameID FROM users WHERE id="+user[tk].id, function(err, rows)
		{
			if(err) throw err;
			if(rows[0].gameID == -1)
			{
				res.send({resp:-1});
				return;
			}
			var GID = rows[0].gameID;
			currDB.query("SELECT `type` FROM current WHERE gameID="+GID+" AND userID="+user[tk].id, function(err, rows)
			{
				if(err) throw err;
				if(rows.length == 0)
				{
					res.send({ok:0});
					return;
				}
				res.send({resp: rows[0].type});
			});
		});
	}
});
app.post('/checkLogin', function(req, res)
{
	if(req.body.token == undefined || !check(req.body.token)) return;
	var tk = token[req.body.token];
	if(tk == undefined) return;
	if(user[tk] != undefined && user[tk].id != undefined && user[tk].id != -1)
	{
		res.send({logged:1});
	}
	else res.send({logged:0});
});

app.post('/login', function(req, res)
{
	console.log(req.body);
	if(req.body.token != undefined && req.body.user != undefined && req.body.pass != undefined && check(req.body.token) && check(req.body.user) && check(req.body.pass))
	{
		var tk = token[req.body.token];
		if(tk == undefined) return;
		currDB.query("SELECT salt FROM users WHERE username='"+req.body.user+"'", function(err1, rows1)
		{
			if(err1) throw err1;
			if(rows1.length == 0) 
			{
				res.send({ok:0});
				return;
			}
			currDB.query("SELECT * FROM users WHERE username='"+req.body.user+"' AND password='"+sha256(req.body.pass, rows1[0].salt).passwordHash+"'", function(err, rows)
			{
				//console.log(rows);
				if(err) throw err;
				if(rows.length == 0)
				{
					res.send({ok:0});
					return;
				}
				console.log(rows[0]['username'] + ' logged in with id: '+rows[0].id);
				//populate user[token[tk]]
				user[tk] = {token: req.body.token, id: rows[0].id}
				res.send({ok:1});
			});
		});
	}
	else res.send({ok: 1});
});
/*app.post('/logout', function(req, res)
{
	console.log(req.body);
	if(req.body.token != undefined && check(req.body.token))
	{
		var tk = token[req.body.token];
		if(tk == undefined) return;
		name[tk] = undefined;
		users[ul++].points = users[tk].points;
		users[ul-1].image = users[tk].image;
		users[ul-1].allowed = users[tk].allowed;
		users[ul-1].tries = users[tk].trie;
		users[ul-1].words = users[tk].words;
		users[ul-1].lang = users[tk].lang;
		token[req.body.token] = ul-1;
	}
});*/
app.post('/checkToken', function(req, res)
{
	if(req.body.token != undefined && check(req.body.token) && token[req.body.token] == undefined)
	{
		var ntoken = genToken(); // Assign a new token to the user
		if(token[ntoken] != undefined) return;
		res.send({valid: 0, ntk: ntoken});
		token[ntoken] = ul;
		user[ul ++] = {token: ntoken, id: -1};
		console.log("User "+ul+" has token "+ntoken);
	}
	else if(req.body.token != undefined && check(req.body.token)) res.send({valid: 1});
});
currDB.connect(function(err)
{
	if(err) console.log("Error connecting to database " + err);
	else
	{
		console.log("Database connected");
	}
});
/*https.createServer(credentials, app).listen(80, function()
{  
    console.log('HTTPS server started on port 80');
    //commandLine();
});*/
/*http.createServer(function(req, res)
{
	res.statusCode = 301;
	//res.setHeader('Location', 'https://'+req.headers.host.split(':')[0]+req.url);
	//res.setHeader('Strict-Transport-Security','max-age=31536000;');
	return res.end();
}).listen(80);
/*http.createServer(function(req, res) {
	//console.log(req.url.slice(1));
	if(req.url.slice(1) != 'favicon.ico') eval(req.url.slice(1));
 	return res.end();
}).listen(3000);*/
//HTTP_redirect();

app.listen(80, function ()
{
  console.log('App listening on port 80!');
});