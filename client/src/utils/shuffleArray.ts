export function shuffleArray(arr: any[]): any[] {
    // make copy to de-reference the argument passed by reference
    let result = [...arr];

    for (let i = 0; i < result.length; i++) {
        let random_index = Math.floor(Math.random() * result.length);
        let current_item = result[i];
        result[i] = result[random_index];
        //avoid dupes
        result[random_index] = current_item;
    }

    return result;
}