import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from '../client/client.component';
import { RelatedinformationComponent } from '../relatedinformation/relatedinformation.component';
import { SearchComponent } from '../client/search/search.component';
import { PageNotFoundComponent } from './not-found.component';

const routes: Routes = [
  // @TODO implement corect router. I do this as an workaround
  { path: '', component: ClientComponent },
  { path: '**', component: ClientComponent }
];

export const AppRoutes = RouterModule.forRoot(routes);
