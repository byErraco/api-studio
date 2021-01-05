//Creacion del controlador
const blogCtrl = {};

//Vista general de los blogs
blogCtrl.renderBlog = (req, res) => {
    if (req.user){
        if (req.user.tipo_cuenta === 'Empresa'){
            const empresa = req.user.tipo_cuenta;
            res.render('./blog/blog', {empresa})        
        }

    }
    res.render('./blog/blog')
};

//Vista de detalle de blog
blogCtrl.renderBlogDetalles = (req, res) => {
    if (req.user){
        if (req.user.tipo_cuenta === 'Empresa'){
            const empresa = req.user.tipo_cuenta;
            res.render('./blog/detalles-blog', {empresa})        
        }

    }
    res.render('./blog/detalles-blog')
};

//Exportando modulo
module.exports = blogCtrl;