import { nanoid, customAlphabet } from 'nanoid';

// 项目内所有数字均保留 4 位小数
export function Round(value: number, n = 4): number {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

// 创建随机ID
export function makeId(): string {
    return nanoid(32);
}

export function makeUserName(): string {
    return customAlphabet(
        'QAZWSXEDCRFVTGBYHNUJMIKOLPploikmjuyhnbgtrfvcdewsxzaq0987654321',
        8,
    )();
}