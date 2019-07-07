/**
 * Message tags
 */
export interface MessageTags {
  [key: string]: boolean | string;
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
  middle: string[];

  /**
   * The trailing parameters.
   */
  trailing: string;
}

/**
 * A message input.
 */
export interface MessageInput {
  /**
   * The tags.
   */
  tags?: string | MessageTags;

  /**
   * The prefix.
   */
  prefix?: string | MessagePrefix;

  /**
   * The command.
   */
  command: string;

  /**
   * The parameters.
   */
  params?: string[];
}
