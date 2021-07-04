export namespace TagsActions {
  export class RefreshTags {
    public static readonly type = '[Tags] Refresh Tags';
  }

  export class CreateTag {
    public static readonly type = '[Tags] Create Tag';

    public constructor(
      public text: string,
    ) {}
  }
}
