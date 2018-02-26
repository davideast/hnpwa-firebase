// This is for syntax highlighting in VSCode
const html = String.raw;

export const story = html`
<section>
  <div class="hn-sr">
    <h2>{{rank}}</h2>
  </div>
  <div class="hn-sd">
    <h4>
      <a href="{{url}}">
      {{title}}
      {{#if domain}}
      <span>({{domain}})</span>
      {{/if}}
      </a>
    </h4>
    <div class="hn-sm">
      {{#if points}}
      {{points}} points
      {{/if}} 
      {{#if user}} 
      by <a href="/users/{{user}}">{{user}}</a> 
      {{/if}}
      {{time_ago}} |
      <a href="/item/{{id}}">{{comments_count}} comments</a>
    </div>
  </div>
</section>
`;

export const commentTree = html`
<div>
  <h2>{{title}} ({{domain}})</h2>
  <div>
    <p class="hn-fl">
      {{points}} points by
      <a href="/user/{{user}}">{{user}}</a>
      {{time_ago}} | {{comments_count}} comments
    </p>
  </div>
  {{> commentList comments }}
</div>
`;

export const commentList = html`
  <div class="hn-cl">
    {{#each this}}
      <div class="hn-ct">
        <div class="hn-c">
          <div>
            <a href="/user/{{user}}">
              {{ user }} | {{ time_ago }}
            </a>
          </div>
          <div>
            {{{ content }}}
          </div>
        </div>
        
        {{> commentList comments }}

      </div>
    {{/each}}
  </div>
`;

export const pager = html`
<div class="hn-p">
  {{#if nextPositive}}
  <a href="/{{topic}}?page={{back}}">back</a>
  {{else}}
  <div></div>
  {{/if}}
  <div>{{current}}</div>
  {{#if maxedOut}}
  <a href="/{{topic}}?page={{next}}">next</a>
  {{else}}
  <div></div>
  {{/if}}  
</div>
`;
