const Discord = require('discord.js')
const client = new Discord.Client();
const sql = require('sqlite')
sql.open("./aidsnames.sqlite")

const pf = ">"
const usable = "abcdefghijklmnopqrstuvwxyz0123456789";
const base = "nUg_Q09z5fxq8Oa"

function nameGen(base) {
    if (base.startsWith("nUg_")) {
        base = base.substring(4)
        let changed = setCharAt(base, Math.floor(Math.random() * base.length), usable[Math.floor(Math.random() * usable.length)])
        return "nUg_" + changed
    }
    else {
        return setCharAt(base, Math.floor(Math.random() * base.length), usable[Math.floor(Math.random() * usable.length)])
    }
}

function randomColor() {
	return Math.round(Math.random() * 16777215);
}

function simpleEmbed(title, description) {
    let embed = {
        "title": title,
        "description": description,
        "footer": {
            "icon_url": client.user.avatarURL,
            "text": "Factions AIDSname gen bot"
        },
        "timestamp": new Date()
    }
    return embed;
}

function setCharAt(str, index, chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

client.on('ready', () => {
    sql.run("CREATE TABLE IF NOT EXISTS names (userID TEXT, name TEXT)");
})

client.on('message', msg => {
    sql.get(`SELECT * FROM names WHERE userID = "${msg.author.id}"`).then(r => {

        if (!r) {
            sql.run(`INSERT INTO names (userID, name) VALUES (?, ?)`, [msg.author.id, "none"]);
        }

        if (msg.content.toLowerCase() ==  pf + "nuggen") {
            let name = "nUg_";
            for(i = 0; i < 11; i++) {
                name += usable[Math.floor(Math.random() * usable.length)]
            }
            msg.channel.send(`Generated name: \`\`\`${name}\`\`\``)
        }

        if (msg.content.toLowerCase() == pf + "whatsmyname") {
            if (r.name ==  "none") {
                msg.author.send(`You don't have an alt name in the database yet... Get one using the \`\`\`${pf}getname\`\`\` command!`)
            }
            else {
                msg.author.send(`The username you requested earlier is "${r.name}"!`)
            }
        }

        if (msg.content.toLowerCase() ==  pf + "namegen") {
            let name = "";
            for(i = 0; i < 15; i++) {
                name += usable[Math.floor(Math.random() * usable.length)]
            }
            msg.channel.send(`Generated name: \`\`\`${name}\`\`\``)
        }

        if (msg.content.toLowerCase() == pf + "resetname") {
            if (r.name ==  "none") {
                msg.author.send(`You don't have an alt name in the database yet... Get one using the \`\`\`${pf}getname\`\`\` command!`)
            }
            else {
              msg.channel.send("Resetting your alt name in the database...") 
              sql.run(`UPDATE names SET name = "none" WHERE userID = "${msg.author.id}"`)
            }
        }

        if (msg.content.toLowerCase() ==  pf + "base") {
            msg.channel.send(`The base AIDSname is: ${base}`)
        }

        if (msg.content.toLowerCase() == pf + "getname") {
            if (r.name ==  "none") {
                let Aname = nameGen(base)
                while (Aname[4] != "Q" || Aname[5] != "0" || Aname[6] != "9" || Aname[13] != "O" || Aname[14] != "a") {
                    Aname = nameGen(base)
                    console.log("Regenerating name...")
                }
                sql.get(`SELECT * FROM names WHERE name = "${Aname}"`).then(r2 => {
                    if (r2) return msg.channel.send("Something went wrong... Please execute the command again.")
                    sql.run(`UPDATE names SET name = "${Aname}" WHERE userID = "${msg.author.id}"`)
                    msg.author.send(`Set your new alt username to "${Aname}" in the database!`)
                })
            }
            else {
                msg.channel.send("Already found a name you requested earlier in the database... Sending you the name in DM!")
                msg.author.send(`The username you requested earlier is "${r.name}"!`)
            }
        }

        if (msg.content.toLowerCase().startsWith(pf + "genchange")) {
            let args = msg.content.split(/\s+/g).slice(1);
            if (args.length > 1) return msg.channel.send("Did you even ask Woody how the command works?")
            if (args.length == 0) {
                args[0] = base
            }
            msg.channel.send(nameGen(args[0]))
        }

        if (msg.content.toLowerCase() == pf + "testaids") {
            msg.channel.send("Generating 10 names with one character different from base...")
            let list = [];
            for (i = 0; i < 10; i++) {
                let Aname = nameGen(base)
                while (Aname[4] != "Q" || Aname[5] != "0" || Aname[6] != "9" || Aname[13] != "O" || Aname[14] != "a") {
                    Aname = nameGen(base)
                }
                list.push(Aname)
            }
            msg.channel.send(list.join("\n"))
        }

        if (msg.content.toLowerCase() == pf + "test") {
            msg.channel.send(usable.length)
            msg.channel.send(usable[1])
        }
    })
})

client.login("TOKEN_REMOVED")
