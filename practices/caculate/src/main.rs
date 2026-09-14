fn main() {
    caculate_v1();
}

// 版本1
fn caculate_v1() {
    println!("caculate_v1");

    let num1 = 10;
    let num2 = 5;
    let op = '+';

    let result = match op {
        '+' => num1 + num2,
        '-' => num1 - num2,
        '*' => num1 * num2,
        '/' => num1 / num2,
        _ => panic!("未知的運算子"),
    };

    println!("結果: {}", result);
}
