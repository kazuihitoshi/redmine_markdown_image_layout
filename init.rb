# frozen_string_literal: true

# Copyright 2026 kazuihitoshi@gmail.com
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

require 'redmine'

module RedmineMarkdownImageLayout
  class ViewHook < Redmine::Hook::ViewListener
    def view_layouts_base_html_head(_context = {})
      return ''.html_safe unless Setting.text_formatting == 'common_mark'

      stylesheet_link_tag('markdown_image_layout', plugin: 'redmine_markdown_image_layout') +
        javascript_include_tag('markdown_image_layout', plugin: 'redmine_markdown_image_layout')
    end
  end
end

Redmine::Plugin.register :redmine_markdown_image_layout do
  name 'Markdown Image Layout'
  author 'kazuihitoshi@gmail.com'
  description 'Shows Markdown images at 30% of the text width, side by side unless a blank line separates them, and full size when clicked.'
  version '1.0.0'
  requires_redmine version_or_higher: '5.0.0'
end

plugin = Redmine::Plugin.find(:redmine_markdown_image_layout)

def plugin.name
  I18n.t(:markdown_image_layout_name, default: 'Markdown Image Layout')
end

def plugin.description
  I18n.t(:markdown_image_layout_description, default: 'Shows Markdown images at 30% of the text width, side by side unless a blank line separates them, and full size when clicked.')
end
