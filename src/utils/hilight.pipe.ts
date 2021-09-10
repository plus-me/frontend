import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// From https://stackoverflow.com/a/52569928

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  public transform(list: string, searchText: string) {
    if (!list) { return []; }
    if (!searchText) { return list; }

    const value = this.replaceAll(
      list,
      searchText,
      `<span class="highlight-text">${searchText}</span>`,
      true);

    console.dir(value);

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  private replaceAll(original: string, find: string, replace: string, ignoreCase: boolean) {
      let result = '';
      let substring = original;
      let substringPosition = 0;
      let substringEnd = -1;

      if (ignoreCase) {
        find = find.toLowerCase(); substring = original.toLowerCase();
      }

      while ((substringEnd=substring.indexOf(find)) > -1) {
        result += original.substring(substringPosition, substringPosition+substringEnd) + replace;
        substring = substring.substring(substringEnd+find.length, substring.length);
        substringPosition += substringEnd+find.length;
      }

      // Add Leftover
      if (substring.length>0) {
        result += original.substring(original.length-substring.length, original.length);
      }

      // Return New String
      return result;
    };
}
