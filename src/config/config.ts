import { Sequelize } from 'sequelize-typescript';
import { Users } from '../models/userModel';
import { Role } from '../models/roleModel';
import { UserDetail } from '../models/userdetailModel';
import { Room } from '../models/roomModel';
import { Invoice } from '../models/invoiceModel';
import { Payment } from '../models/paymentModel';
import { Report } from '../models/reportModel';
import { RoomType } from '../models/roomtypeModel';
import { Districts } from '../models/districtsModel';
import { Provinces } from '../models/provincesModel';
import { SubDistricts } from '../models/sub_districtsModel';
import { PaymentType } from '../models/paymentTypeModel';
import { UserRoom } from '../models/user_roomModel';
import { ReportType } from '../models/reporttypeModel';
import { Threads } from '../models/threadsModel';
import { Posts } from '../models/postsModel';
import { Comment } from '../models/commentModel';
import { Payee } from '../models/payeeModel';
import dotenv from 'dotenv';
dotenv.config();

const connection = new Sequelize({
  dialect: 'mysql',
  host: process.env.HOST_DB || 'localhost',
  username: process.env.USER_DB || 'root',
  password: process.env.PASSWORD_DB || '',
  database: process.env.NAME_DB || 'name_db',
  logging: false,
  models: [
    Users,
    Role,
    UserDetail,
    Room,
    Invoice,
    Payment,
    Report,
    RoomType,
    Districts,
    Provinces,
    SubDistricts,
    PaymentType,
    UserRoom,
    ReportType,
    Threads,
    Posts,
    Comment,
    Payee,
  ],
  sync: { force: false, alter: true },
});

export default connection;
