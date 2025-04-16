import { Hono } from 'hono';
import { inspectRoutes } from 'hono/dev';

interface DisplayRoutesTreeOptions {
  colorize?: boolean;
  showHeader?: boolean;
  headerText?: string;
}

// TODO: Get this to work for OpenAPIHono apps as well.

/**
 * Displays the routes tree of a Hono app.
 * @param app - The Hono app instance.
 * @param options - Optional configuration options.
 * @returns The routes tree
 *
 * @example
 * const app = new Hono();
 * app.get('/users', (c) => c.text('Get Users'), 'getUsers');
 * app.post('/users', (c) => c.text('Create User'), 'createUser');
 * app.get('/users/:id', (c) => c.text('Get User by ID'), 'getUserById');
 *
 * // Default display with header
 * const routesTree = displayRoutesTree(app);
 * console.log(routesTree);
 *
 * // Custom header
 * const customHeaderTree = displayRoutesTree(app, {
 *   headerText: 'My API Endpoints:'
 * });
 * console.log(customHeaderTree);
 *
 * // No header
 * const noHeaderTree = displayRoutesTree(app, {
 *   showHeader: false
 * });
 * console.log(noHeaderTree);
 */
export function displayRoutesTree(
  app: Hono,
  options: DisplayRoutesTreeOptions = {},
): string {
  // Get all routes using inspectRoutes
  const routes = inspectRoutes(app);

  // Default header options
  const colorize = options.colorize !== undefined ? options.colorize : true;
  const showHeader = options.showHeader !== undefined
    ? options.showHeader
    : true;
  const headerText = options.headerText || 'API Routes Tree:';

  // ANSI color codes
  const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    reset: '\x1b[0m',
  };

  // Helper function to apply color if enabled
  const applyColor = (text: string, color: keyof typeof colors): string => {
    if (colorize) {
      return `${colors[color]}${text}${colors.reset}`;
    }
    return text;
  };

  // Create a tree structure for routes
  interface RouteNode {
    segment: string;
    fullPath: string;
    methods: Array<{ method: string; name: string; isMiddleware: boolean }>;
    children: Record<string, RouteNode>;
  }

  // Initialize the root of the tree
  const routeTree: RouteNode = {
    segment: 'ROOT',
    fullPath: '',
    methods: [],
    children: {},
  };

  // Build the tree structure
  routes.forEach((route) => {
    const pathSegments = route.path.split('/').filter(Boolean);
    let currentNode = routeTree;
    let currentPath = '';

    // Navigate or create the path in the tree
    pathSegments.forEach((segment) => {
      currentPath += '/' + segment;

      if (!currentNode.children[segment]) {
        currentNode.children[segment] = {
          segment,
          fullPath: currentPath,
          methods: [],
          children: {},
        };
      }

      currentNode = currentNode.children[segment];
    });

    // Add the method to the leaf node
    currentNode.methods.push({
      method: route.method,
      name: route.name,
      isMiddleware: route.isMiddleware,
    });
  });

  // Array to collect output lines
  const outputLines: string[] = [];

  // Function to print the tree recursively
  function printTree(
    node: RouteNode,
    prefix: string = '',
    isLast: boolean = true,
  ) {
    // Print current node
    if (node.segment !== 'ROOT') {
      const connector = isLast ? '└─' : '├─';

      // Color route variables (segments starting with ':') in yellow
      // Color wildcards in magenta
      let displaySegment = node.segment;
      if (displaySegment.startsWith(':')) {
        displaySegment = applyColor(displaySegment, 'yellow');
      } else if (displaySegment === '*' || displaySegment === '**') {
        displaySegment = applyColor(displaySegment, 'magenta');
      }

      outputLines.push(`${prefix}${connector} ${displaySegment}`);

      // Print methods for this path
      if (node.methods.length > 0) {
        // Sort methods
        node.methods.sort((a, b) => a.method.localeCompare(b.method));

        const methodPrefix = prefix + (isLast ? '   ' : '│  ');
        node.methods.forEach((routeMethod, idx) => {
          const isLastMethod = idx === node.methods.length - 1 &&
            Object.keys(node.children).length === 0;
          const methodConnector = isLastMethod ? '└─' : '├─';

          // Color the HTTP verb green
          const coloredMethod = applyColor(
            routeMethod.method.padEnd(6),
            'green',
          );

          // Color middleware tag blue
          let middlewareTag = '';
          if (routeMethod.isMiddleware) {
            middlewareTag = applyColor('[Middleware]', 'blue');
          }

          outputLines.push(
            `${methodPrefix}${methodConnector} ${coloredMethod} ${middlewareTag} ${
              routeMethod.name || '<unnamed>'
            }`,
          );
        });
      }
    }

    // Print children
    const childrenKeys = Object.keys(node.children).sort();
    childrenKeys.forEach((key, idx) => {
      const child = node.children[key];
      const newPrefix = node.segment === 'ROOT'
        ? ''
        : prefix + (isLast ? '   ' : '│  ');
      const isLastChild = idx === childrenKeys.length - 1;
      printTree(child, newPrefix, isLastChild);
    });
  }

  // Add header to output if showHeader is true
  if (showHeader) {
    outputLines.push(headerText);
    outputLines.push('-'.repeat(headerText.length));
  }

  // Generate the tree
  printTree(routeTree);

  // Join all lines with newlines and return as a single string
  return outputLines.join('\n');
}
