/**
 * Message tags
 */
export interface MessageTags {
  [key: string]: true | string;
}

/**
 * A message prefix.
 */
export interface MessagePrefix {
  /**
   * The name.
   */
  name: string;

  /**
   * The user.
   */
  user?: string;

  /**
   * The host.
   */
  host?: string;
}

/**
 * A message.
 */
export interface Message {
  /**
   * The tags.
   */
  tags?: MessageTags;

  /**
   * The prefix.
   */
  prefix?: MessagePrefix;

  /**
   * The command.
   */
  command: string;

  /**
   * The parameters.
   */
  params: string[];

  /**
   * The middle parameters.
   */
  readonly middle: string[];

  /**
   * The trailing parameters.
   */
  readonly trailing: string;
}
