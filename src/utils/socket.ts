import { StringBatcher } from 'stringbatcher';

export function bathMessage(size: number) {
    return function (sendFn: (chunk: string) => void) {
        return new StringBatcher({
            batchSize: size,
            process: async (chunk) => {
                sendFn(chunk);
                console.log(1, chunk);
            },
        });
    };
}
