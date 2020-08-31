import {Injectable} from '@angular/core';

import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {StorageService} from '../storage/storage.service';
import {AuthService} from '../auth/auth.service';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private storageService: StorageService, private authService: AuthService) {
    };

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.storageService.getTokens().isValid()) {
            const IdToken = this.storageService.getTokens().getIdToken().getJwtToken();
            request = request.clone({headers: request.headers.set('Authorization', IdToken)});
        } else {
            this.authService.logout();
        }
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                }
                return event;
            }));
    }
}
