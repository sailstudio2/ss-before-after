<?php
/**
 * Plugin Name: SS Gutenberg Before After
 * Description: Gutenberg block for Before/After works with grid, slider and pagination.
 * Version: 1.0.0
 * Author: SailStudio
 * Text Domain: ss-before-after
 */

if (!defined('ABSPATH')) {
	exit;
}

// Register image size with hard crop (520x300)
function ss_before_after_init()
{
	add_image_size('ss-before-after', 520, 300, true);
}
add_action('init', 'ss_before_after_init');

// Enqueue frontend styles
function ss_before_after_scripts()
{
	wp_enqueue_style('ss-before-after-main', plugins_url('style.css', __FILE__), array(), '1.0.0');
}
add_action('wp_enqueue_scripts', 'ss_before_after_scripts');

// Add editor wrapper styles support for iframe
function ss_before_after_editor_setup()
{
	add_editor_style('style.css');
}
add_action('after_setup_theme', 'ss_before_after_editor_setup');

// Register block from build folder and attach render function
function ss_before_after_register_block()
{
	if (!function_exists('register_block_type')) {
		return;
	}

	register_block_type(__DIR__ . '/build', array(
		'render_callback' => 'ss_before_after_render_block',
	));
}
add_action('init', 'ss_before_after_register_block');

// Block dynamic render function on frontend
function ss_before_after_render_block($attributes, $content)
{
	$items = isset($attributes['items']) ? $attributes['items'] : array();

	if (empty($items)) {
		return '';
	}

	ob_start();
	?>
	<div class="ss-before-after-wrapper" data-total="<?php echo esc_attr(count($items)); ?>">
		<div class="ss-before-after-grid">
			<?php foreach ($items as $index => $item): ?>
				<div class="ss-before-after-item" data-index="<?php echo esc_attr($index); ?>">

					<div class="ss-ba-slider">
						<?php if (!empty($item['afterImage'])): ?>
							<img class="ss-ba-after"
								src="<?php echo esc_url(wp_get_attachment_image_url($item['afterImage'], 'ss-before-after') ?: $item['afterImageUrl']); ?>"
								alt="After">
						<?php endif; ?>

						<?php if (!empty($item['beforeImage'])): ?>
							<div class="ss-ba-before-wrapper">
								<img class="ss-ba-before"
									src="<?php echo esc_url(wp_get_attachment_image_url($item['beforeImage'], 'ss-before-after') ?: $item['beforeImageUrl']); ?>"
									alt="Before">
							</div>
						<?php endif; ?>

						<div class="ss-ba-handle">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="12" cy="12" r="12" fill="#584C4C" />
								<path d="M10 16L6 12L10 8" stroke="white" stroke-width="1.5" stroke-linecap="round"
									stroke-linejoin="round" />
								<path d="M14 8L18 12L14 16" stroke="white" stroke-width="1.5" stroke-linecap="round"
									stroke-linejoin="round" />
							</svg>
						</div>
					</div>

					<div class="ss-ba-info">
						<?php
						$title = !empty($item['title']) ? $item['title'] : (!empty($item['clientName']) ? $item['clientName'] : '');
						if ($title): ?>
							<strong class="ss-info-title"><?php echo esc_html($title); ?></strong>
						<?php endif; ?>

						<?php if (!empty($item['text'])): ?>
							<div class="ss-ba-text">
								<p><?php echo wp_kses_post($item['text']); ?></p>
							</div>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>

		<?php if (count($items) > 6): ?>
			<div class="ss-ba-pagination"></div>
		<?php endif; ?>
	</div>
	<?php
	return ob_get_clean();
}
