import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GitHubProfile } from '../interfaces/github-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private http = inject(HttpClient);

  getProfile(username: string) {
    return this.http.get<GitHubProfile>(
      `https://api.github.com/users/${username}`
    );
  }
}