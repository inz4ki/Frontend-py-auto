import Cookie from "js-cookie"

export default{
    auth(to,from,next){
        const token = Cookie.get('_usuario_token');

        if(!token){
            next({name:'login'});
        }else{
        console.log('passou')
         next();
        }
    }
}
