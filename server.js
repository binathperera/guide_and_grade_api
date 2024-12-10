import express from 'express';
import cors from 'cors';

const port = process.env.PORT || 5000;

const app = express();
app.locals.startTime= 180;
app.locals.warnTime= 30;
app.locals.stopTime= 0;
app.locals.timeRunner= 0;

app.locals.red=true;
app.locals.yellow=false;
app.locals.green=false;

app.locals.record=false;


app.use(express.json());
app.use(cors());

app.locals.mainTimer;

function mainCountdown(){
    if (app.locals.timeRunner==0){
        clearInterval(app.locals.mainTimer);
    }else{
        time=app.locals.timeRunner--;
        if(time>app.locals.warnTime){
            app.locals.green=true;
            app.locals.yellow=false;
            app.locals.red=false;
        }else if(time<=app.locals.warnTime && time>app.locals.stopTime){
            app.locals.green=false;
            app.locals.yellow=true;
            app.locals.red=false;
        }else{
            app.locals.green=false;
            app.locals.yellow=false;
            app.locals.red=true;
        }
    }
    console.log(app.locals.timeRunner);
}

app.put("/setStartTime", (req, res) =>{
    app.locals.startTime= req.body.startTime;
    app.locals.timeRunner= app.locals.startTime;
    console.log(app.locals.timeRunner);
    res.end();
});
app.put("/setWarnTime", (req, res) =>{
    app.locals.warnTime= req.body.warnTime;
    console.log(app.locals.timeRunner);
    res.end();
});
app.put("/setStopTime", (req, res) =>{
    app.locals.stopTime= req.body.stopTime;
    console.log(app.locals.timeRunner);
    res.end();
});


app.post("/startTimer", (req, res) =>{
    clearInterval(app.locals.mainTimer);
    app.locals.mainTimer = setInterval(mainCountdown, 1000);
    app.locals.record=true;
    res.end();
});


app.post("/stopTimer",(req,res)=>{
    clearInterval(app.locals.mainTimer);
    app.locals.record=false;
    res.end();
})

app.put("/resetTimer",(req,res)=>{
    clearInterval(app.locals.mainTimer);
    app.locals.timeRunner=app.locals.mainTime;
    res.end();
})

app.get('/timer', (req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    res.write('timer connected');

    setInterval(() => {
        const data= { time:`${app.locals.timeRunner}`, red:`${app.locals.red}`,yellow:`${app.locals.yellow}`,green:`${app.locals.green}`}
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 1000);
    // Close the connection when the client disconnects
    req.on('close', () => res.end('OK'))
});

app.get('/record', (req, res) => {
    res.writeHead(200,{
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    res.write('record endpoint connected');

    setInterval(() => {
        const data= { record:`${app.locals.record}`}
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 1000);
    // Close the connection when the client disconnects
    req.on('close', () => res.end('OK'))
});

app.post('/submitrecord', (req, res) => {
    const content  = req.body;
    const body= {};
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(body));
    res.end();
});



app.post("/saveReport", async(req,res)=>{
    const content  = req.body;
    const body= await saveReport();
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(body));
    res.end();
})

async function saveReport(){
    
}

async function generateReport(){
    
}

app.listen(port, ()=> {console.log(`Server started on port ${port}`)})