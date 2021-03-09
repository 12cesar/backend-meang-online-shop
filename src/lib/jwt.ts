import { SECRET_KEY,MESSAGES, EXPIRETIME } from '../config/constants';
import jwt from 'jsonwebtoken';
import { IJwt } from '../interfaces/jwt.interface';

class JWT{
    private secretKey=SECRET_KEY as string;
    // tslint:disable-next-line: no-any
    sign(data:IJwt,expiresIn:number=EXPIRETIME.H24){
        //iNFORMACION DEL PAYLOAD CON FECHA DE CADUCIDAD 24 HROAS POR DEFECTO
        return jwt.sign(
            {user:data.user},
            this.secretKey,
            {expiresIn} //24 HORAS DE CADUCIDAD
        );
    }

    verify(token:string){
        try{ 
            return jwt.verify(token,this.secretKey);
        }catch(e){
            return MESSAGES.TOKEN_VERICATION_FAILED;
        }
    }
}

export default JWT;