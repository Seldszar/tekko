/**
 * Message tags
 */
export interface MessageTags {
  [key: string]: string | true;
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
export interface Message<T = MessageTags> {
  /**
   * The tags.
   */
  tags?: T;

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

interface MessageInput {
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
}

export interface MessageInputLegacy extends MessageInput {
  /**
   * The parameters.
   */
  params?: string[];
}

export interface MessageInputComposite extends MessageInput {
  /**
   * The middle parameters.
   */
  middle?: string[];

  /**
   * The trailing parameters.
   */
  trailing?: string;
}
