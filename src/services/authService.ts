import { getToday } from "../utils/getToday";
import jwtConfig from "../utils/jwtConfig";
import jwt from "jsonwebtoken";

class AuthService {

    validatePassword = (password: string): boolean => {
        const currentPassword = getToday.split("/").join("");
        return password === currentPassword;
    };

    createToken = () => {
        const token = jwt.sign({ getToday }, jwtConfig.keyConfig as string, {
            expiresIn: jwtConfig.expiresin as string,
        });
        return token;
        // retorna o Token
    };
}

export default new AuthService();
