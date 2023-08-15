export const EmailTemplate = (props: any) => {
    const html = `
        <div style="font-family: 'Kanit', sans-serif;">
            <div style="background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; margin-top: 20px;">
                        <h1>สวัสดีคุณ ${props.fname + " " + props.lname}</h1>
                    <div style="text-align: center; margin-top: 20px;">
                        <h1>บิลชำระเงินค่าหอพัก</h1>
                    </div>
                    <div style="text-align: center; margin-top: 20px; font-size: x-large">
                        <h1>จำนวนเงิน : ${props.totalPrice + " " +"บาท"}</h1>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <h3>หอพักห้อง ${props.room_number}</h3>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <h3>รายละเอียดการชำระเงิน</h3>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">รายการ</th>
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">เลขครั้งนี้</th>
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">เลขครั้งก่อน</th>
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">จำนวนที่ใช้ไป</th>
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">ราคาต่อหน่วย(บาท)</th>
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">จำนวนเงิน</th>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">ค่าน้ำ</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.watermeter_new}</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.watermeter_old}</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.watermeter_new - props.watermeter_old}</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.water_price}</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.waterPrice + " " + "บาท"}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">ค่าไฟ</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.electricmeter_new}</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.electricmeter_old}</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.electricmeter_new - props.electricmeter_old}</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.electric_price}</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.electricPrice + " " + "บาท"}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">ค่าห้องพัก</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;" colSpan="4"></td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${props.room_price + " " + "บาท"}</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-size: xx-large;">รวม</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;" colSpan="4"></td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-size: xx-large;">${props.totalPrice + " " + "บาท"}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <h3>วิธีการชำระเงิน</h3>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">ธนาคาร</th>
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">เลขบัญชี</th>
                                <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">ชื่อบัญชี</th>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">ธนาคารไทยพาณิชย์</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">123-4-56789-0</td>
                                <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">นาย สมชาย ใจดี</td>
                            </tr>
                        </table>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <h3>หมายเหตุ</h3>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <p>กรุณาชำระเงินภายในวันที่ 10 ของทุกเดือน</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const text = `
        Test Email
        ${props.text}
    `;

    const subject = 'บิลชำระเงินค่าหอพัก';

    return { html, text, subject };
}
