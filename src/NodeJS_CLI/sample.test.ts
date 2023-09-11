// テストユニットのコード

test('sample test', () => {

    // OK
    expect(1 + 2).toStrictEqual(3);

    // NG
    // expect(1 + 2).toStrictEqual(2);
});


const sum = (...a: number[]) => a.reduce((acc, val) => acc + val, 0);


test('basic', () => {
    expect(sum()).toBe(0);
});


test('basic again', () => {
    expect(sum(1, 2)).toBe(3);
});


test('basic async', async () => {
    expect(sum()).toBe(0);
});


test('basic again async', async () => {
    expect(sum(1, 2)).toBe(3);
}, 1000 /* optional timeout */);