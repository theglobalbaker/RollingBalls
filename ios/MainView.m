/* This file is part of Rolling Balls.
 * Copyright (C) 2013 David Lloyd
 *
 * Rolling Balls is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Rolling Balls is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Rolling Balls.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This code may be installed through thirdparty Application Stores.
 */
#import "MainView.h"
#import "Resources.h"

@implementation MainView

UIWebView * webView;

// Construct the MainView
- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code
    }
    return self;
}

// Create a fullscreen web browser
- (id)initWithCoder:(NSCoder *)decoder
{
    id instance = [super initWithCoder:decoder];
    
    // Load the file URL describing the location of the HTML files
    NSURL * baseURL = [NSURL fileURLWithPath:[[NSBundle mainBundle] bundlePath]];
    
    // Load the UIWebView and initialise it with data from the resource files
    webView = [[UIWebView alloc] init];
    webView.delegate = self;
    [webView loadHTMLString:[Resources loadSourceCode] baseURL:baseURL];
    
    // Add the UIWebView to the view and make it fullscreen
    [self addSubview:webView];
    CGSize size = [UIScreen mainScreen].bounds.size;
    [webView setFrame:CGRectMake(0, 0, size.width, size.height )];
    
    //    [Resources playSound:@"HallOfTheMountainKing.wav"];
    
    return instance;
}

// Implement UIWebView callbacks
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSString * url = [[request URL] absoluteString];
    
    // Default page is OK
    if ( NSOrderedSame == [url compare:@"about:blank"] )
    {
        return YES;
    }
    
    // The mainloop can't run audio events
    if ( [url hasPrefix:@"run-priv://"] )
    {
        NSString * method = [url substringFromIndex:11];
        [webView stringByEvaluatingJavaScriptFromString:method];
        return NO;
    }
    
    // This covers the resources on the filesystem
    if ( [url hasPrefix:@"file://"] )
    {
        return YES;
    }
    
    // The user has clicked on the "Return to game"
    if ( NSOrderedSame == [url compare:@"about:exit"] )
    {
        NSString *path = [[NSBundle mainBundle] bundlePath];
        NSURL *baseURL = [NSURL fileURLWithPath:path];
        [webView loadHTMLString:[Resources loadSourceCode] baseURL:baseURL];
        return NO;
    }
    
    // Open the real webbrowser otherwise
    [[UIApplication sharedApplication] openURL:[request URL]];
    return NO;
}

@end
