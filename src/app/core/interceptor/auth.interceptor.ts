import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    // Automatically attach JWT token to all outgoing HTTP requests
    if (user?.token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${user.token}`,
            },
        });
    }

    return next(req);
};
