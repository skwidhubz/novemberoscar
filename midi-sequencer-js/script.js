// yeebos

var counterEl = document.getElementById("counter");
var noteLengthEl = document.getElementById("note-length");
var stopButton = document.getElementById('stop-button');
var startButton = document.getElementById('stop-button');

function consoleDom(){
    counterEl.innerHTML = "";
    noteLengthEl.innerHTML = "";
    counterEl.textContent = "Global Counter: " + global_counter_ms;
    noteLengthEl.textContent = "Note Length: " + note_length;
}


startButton.addEventListener("click", console.log("stop seq")); // start seq
stopButton.addEventListener("click",console.log("stop seq")); // stop seq

const ONE_MIN_MS = 60000.0;
const BPM = 120.0;
const NUMERATOR = 4.0;
const DENOMINATOR = 4.0;
const MIN_NOTE_DENOMINATOR = 16.0;

const ONE_NOTE_IN_MS = (ONE_MIN_MS/BPM)*4.0;

const BAR_LENGTH_IN_BEATS = (NUMERATOR*(1.0 / DENOMINATOR));

const MIN_NOTE_LENGTH_IN_MS = ONE_NOTE_IN_MS * (1.0 / MIN_NOTE_DENOMINATOR);


var global_counter_ms = 0;
var global_fractional = 0.0;


function sequencerTick() {

        var diff = Math.trunc( MIN_NOTE_LENGTH_IN_MS );
 
        let frac = (MIN_NOTE_LENGTH_IN_MS-Math.trunc( MIN_NOTE_LENGTH_IN_MS ));
        global_fractional = global_fractional + frac;
        if ( global_fractional >= 1.0 ) {
            diff = diff + 1.0; 
            global_fractional = global_fractional - 1.0;
        }
    
        console.log( "counter: " + global_counter_ms + "     diff:" + diff );
        consoleDom();
        global_counter_ms += diff;
        doSeqThing();
        setTimeout(sequencerTick,diff);



}

let midiOutput = null;
navigator.requestMIDIAccess()
.then(function(midiAccess) {
  const outputs = Array.from(midiAccess.outputs.values());
  console.log(outputs);
  midiOutput = outputs[0];
  sequencerTick();
});

const MAX_REST = 4;
const MAX_NOTELEN = 16;

var midi_channel = 4;
var note_length = -1;
var note_playing = 0;

function doSeqThing() { // main seq function
    console.log("note-length "+note_length);
    if ( note_length <= 0 ) {
        if ( note_length == 0) {
            const noteOffMessage = [0x80 | midi_channel, note_playing, 0x7f];    // note on, middle C, full velocity
            midiOutput.send(noteOffMessage); // sends the message.
        }
        note_length = -1;
        
        let rest_probability = (getRandomInt(100) > 99);

        if ( !rest_probability ) {
            note_length = MIN_NOTE_LENGTH_IN_MS*randPow2(MAX_NOTELEN);
            note_playing = quantizeMinor( (12*4) + getRandomInt(12) );
            const noteOnMessage = [0x90 | midi_channel , note_playing, 0x7f];    // note on, middle C, full velocity
            midiOutput.send(noteOnMessage); // sends the message.
            sendMidiCC7(10,getRandomInt( 127 ));
        } else {
            // REST
            note_length = MIN_NOTE_LENGTH_IN_MS*randPow2(MAX_REST);
        }
    }
    note_length -= MIN_NOTE_LENGTH_IN_MS;

    //sendMidiCC14(17,getRandomInt( 16384 ));
    
}

function sendMidiCC14(ccNum,value) { // value is a 14bit number
    const ccMessage1 = [0xB0 | midi_channel , ccNum , value & 0x7F ];
    const ccMessage2 = [0xB0 | midi_channel , ccNum , (value >> 7) & 0x7F ];
    midiOutput.send(ccMessage1); // sends the message.
    midiOutput.send(ccMessage2); // sends the message.
}
function sendMidiCC7(ccNum,value) { // value is a 7bit number
    const ccMessage1 = [0xB0 | midi_channel , ccNum , value & 0x7F ];
    midiOutput.send(ccMessage1); // sends the message.
}

function randPow2(max) {
    var value = getRandomInt(max);
    if ( value % 2) {
        if ( getRandomInt(100) >=90 ) {
            value++;
        }
        else {
            value--;
        }
    }
    
    return value;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
                    //W, H, W, W, H, W
const MINOR_SCALE = [ 1, 3, 5, 7, 12 ];

const ONE_OCTAVE = 12;

const root_note = 7;

function quantizeMinor(note) {

    let OCTAVE = note / ONE_OCTAVE;
    let quant = (OCTAVE * ONE_OCTAVE);

    quant += root_note;

    let NOTE = note % ONE_OCTAVE;

    for ( i=0; i<MINOR_SCALE.length; i++ ) {

       if ( note === i) {
            return quant + note;
       }
       else if ( note >= MINOR_SCALE[ i ]) {
            return quant + MINOR_SCALE[ i ];
       }

    }
    return quant;
}
