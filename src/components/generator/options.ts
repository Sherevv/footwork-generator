export class SoundOption {
    soundType = 1;
    bpm = 130;
    isPlayAccent = false;
    accentBit = 8;
}

export class GeneratorOption {
    bit_count = 8;
    rows = 1;
    evenness = 'even';
    syncopation = 0;
    rock_step = true;
    step_names = true;
    show_bits = true;
    show_row_index = true;
    show_triple = true;
    couple = true;
    sound = new SoundOption();
    kick_instead_hold = false;
    manual_mode = false;
    nums?: number[];
}

