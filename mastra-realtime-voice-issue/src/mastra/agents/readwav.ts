import * as fs from 'fs';

// read wav
export function readWavAsInt16Array(filePath: string): { data: Int16Array, sampleRate: number } {
    const buffer = fs.readFileSync(filePath);

    // check if it starts with "RIFF"
    if (buffer.toString('ascii', 0, 4) !== 'RIFF') {
        throw new Error('Not a valid WAV file.');
    }

    // check if it is 24kHz
    const sampleRate = buffer.readUInt32LE(24);
    if (sampleRate !== 24000) {
        throw new Error(`Sample rate is ${sampleRate}Hz, not 24kHz.`);
    }

    // check if it is 16-bit
    const bitsPerSample = buffer.readUInt16LE(34);
    if (bitsPerSample !== 16) {
        throw new Error('This script only supports 16-bit PCM WAV files.');
    }

    // find the start of the "data" chunk
    let dataOffset = 12;
    while (buffer.toString('ascii', dataOffset, dataOffset + 4) !== 'data') {
        // get the size of the chunk and move to the next chunk
        const chunkSize = buffer.readUInt32LE(dataOffset + 4);
        dataOffset += 8 + chunkSize;
        if (dataOffset >= buffer.length) {
            throw new Error('Cannot find "data" chunk.');
        }
    }

    // get the size of the "data" chunk and the start of the PCM data
    const dataSize = buffer.readUInt32LE(dataOffset + 4);
    const pcmStart = dataOffset + 8;
    const pcmEnd = pcmStart + dataSize;

    const pcmBuffer = buffer.slice(pcmStart, pcmEnd);

    // check if the PCM data is in 2-byte chunks
    if (pcmBuffer.length % 2 !== 0) {
        throw new Error('PCM data length is not a multiple of 2.');
    }

    return {
        data: new Int16Array(pcmBuffer.buffer, pcmBuffer.byteOffset, pcmBuffer.length / 2),
        sampleRate
    };
}
