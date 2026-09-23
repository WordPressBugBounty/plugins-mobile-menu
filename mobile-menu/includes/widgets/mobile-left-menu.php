<?php
/**
 * Mobile Left Menu Elementor Widget.
 *
 * Elementor widget that displays the complete mobile left menu panel.
 *
 * @since 1.0.0
 */
class Mobile_Left_Menu_El_Widget extends \Elementor\Widget_Base {

	/**
	 * Get widget name.
	 *
	 * Retrieve the widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'mobile_left_menu';
	}

	/**
	 * Get widget title.
	 *
	 * Retrieve the widget title.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Mobile Left Menu', 'mobile-menu' );
	}

	/**
	 * Get widget icon.
	 *
	 * Retrieve the widget icon.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-nav-menu';
	}

	/**
	 * Get widget categories.
	 *
	 * Retrieve the list of categories the widget belongs to.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Widget categories.
	 */
	public function get_categories() {
		return [ 'general' ];
	}

	/**
	 * Get widget keywords.
	 *
	 * Retrieve the list of keywords the widget belongs to.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return array Widget keywords.
	 */
	public function get_keywords() {
		return [ 'mobile', 'menu', 'navigation', 'left', 'hamburger' ];
	}

	/**
	 * Register the widget controls.
	 *
	 * Input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function _register_controls() {

		// Content Section
		$this->start_controls_section(
			'content_section',
			[
				'label' => __( 'Menu Settings', 'mobile-menu' ),
				'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'menu_select',
			[
				'label'   => __( 'Select Menu', 'mobile-menu' ),
				'type'    => \Elementor\Controls_Manager::SELECT,
				'options' => $this->get_available_menus(),
				'default' => '',
				'description' => __( 'Choose which menu to display in the left panel', 'mobile-menu' ),
			]
		);

		$this->add_control(
			'show_button',
			[
				'label'   => __( 'Show Menu Button', 'mobile-menu' ),
				'type'    => \Elementor\Controls_Manager::SWITCHER,
				'default' => 'yes',
				'description' => __( 'Display the hamburger button to open the menu', 'mobile-menu' ),
			]
		);

		$this->add_control(
			'button_text',
			[
				'label'       => __( 'Button Text', 'mobile-menu' ),
				'type'        => \Elementor\Controls_Manager::TEXT,
				'default'     => '',
				'placeholder' => __( 'Menu', 'mobile-menu' ),
				'condition'   => [
					'show_button' => 'yes'
				],
			]
		);

		$this->end_controls_section();

		// Style Section - Button
		$this->start_controls_section(
			'button_style_section',
			[
				'label' => __( 'Button Style', 'mobile-menu' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
				'condition' => [
					'show_button' => 'yes'
				],
			]
		);

		$this->add_control(
			'button_color',
			[
				'label'   => __( 'Button Color', 'mobile-menu' ),
				'type'    => \Elementor\Controls_Manager::COLOR,
				'default' => '#333333',
				'selectors' => [
					'{{WRAPPER}} .mobmenu-left-bt i' => 'color: {{VALUE}}',
					'{{WRAPPER}} .mobmenu-left-bt img' => 'filter: {{VALUE}}',
				],
			]
		);

		$this->add_control(
			'button_size',
			[
				'label'   => __( 'Button Size', 'mobile-menu' ),
				'type'    => \Elementor\Controls_Manager::SLIDER,
				'range'   => [
					'px' => [
						'min' => 10,
						'max' => 100,
					],
				],
				'default' => [
					'size' => 25,
				],
				'selectors' => [
					'{{WRAPPER}} .mobmenu-left-bt i' => 'font-size: {{SIZE}}{{UNIT}}',
					'{{WRAPPER}} .mobmenu-left-bt img' => 'width: {{SIZE}}{{UNIT}}',
				],
			]
		);

		$this->add_control(
			'button_padding',
			[
				'label'      => __( 'Button Padding', 'mobile-menu' ),
				'type'       => \Elementor\Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', 'em', '%' ],
				'default'    => [
					'top'    => '10',
					'right'  => '15',
					'bottom' => '10',
					'left'   => '15',
					'unit'   => 'px',
				],
				'selectors' => [
					'{{WRAPPER}} .mobmenu-left-bt' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}}',
				],
			]
		);

		$this->end_controls_section();

		// Style Section - Menu Panel
		$this->start_controls_section(
			'panel_style_section',
			[
				'label' => __( 'Menu Panel Style', 'mobile-menu' ),
				'tab'   => \Elementor\Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'panel_background',
			[
				'label'   => __( 'Panel Background', 'mobile-menu' ),
				'type'    => \Elementor\Controls_Manager::COLOR,
				'default' => '#ffffff',
				'description' => __( 'This will override the global panel background color for this widget instance', 'mobile-menu' ),
			]
		);

		$this->add_control(
			'panel_text_color',
			[
				'label'   => __( 'Panel Text Color', 'mobile-menu' ),
				'type'    => \Elementor\Controls_Manager::COLOR,
				'default' => '#333333',
				'description' => __( 'This will override the global panel text color for this widget instance', 'mobile-menu' ),
			]
		);

		$this->add_control(
			'panel_width',
			[
				'label'   => __( 'Panel Width', 'mobile-menu' ),
				'type'    => \Elementor\Controls_Manager::SLIDER,
				'range'   => [
					'%' => [
						'min' => 20,
						'max' => 100,
					],
					'px' => [
						'min' => 200,
						'max' => 800,
					],
				],
				'size_units' => [ '%', 'px' ],
				'default' => [
					'size' => 80,
					'unit' => '%',
				],
				'description' => __( 'Width of the menu panel when opened', 'mobile-menu' ),
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Get available WordPress menus.
	 *
	 * @return array
	 */
	private function get_available_menus() {
		$menus = wp_get_nav_menus();
		$options = [ '' => __( 'Use Global Setting', 'mobile-menu' ) ];
		
		foreach ( $menus as $menu ) {
			$options[ $menu->term_id ] = $menu->name;
		}
		
		return $options;
	}

	/**
	 * Render widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();
		global $mobile_menu_instance;
		
		// Ensure the mobile menu is initialized
		if ( ! $mobile_menu_instance ) {
			return;
		}

		$plugin_settings = MobileMenuOptions::getInstance( 'mobmenu' );
		
		// Get settings from widget or fallback to global settings
		$menu_type   = 'left';
		$menu_text   = ! empty( $settings['button_text'] ) ? $settings['button_text'] : $plugin_settings->getOption( 'left_menu_text' );
		$icon_action = true; // Always show as action button for Elementor widget
		$icon_target = $plugin_settings->getOption( 'left_icon_url_target' );
		$icon_url    = $plugin_settings->getOption( 'left_icon_url' );
		$icon_font   = $plugin_settings->getOption( 'left_menu_icon_font' );
		$icon        = $plugin_settings->getOption( 'left_menu_icon' );
		$icon_new    = $plugin_settings->getOption( 'left_menu_icon_new' );
		$animation   = $plugin_settings->getOption( 'left_menu_icon_animation' );
		$close_icon  = $plugin_settings->getOption( 'close_icon_font' );

		// Add custom CSS for this widget instance
		$this->add_widget_custom_css( $settings );

		// Enqueue required scripts
		$mobile_menu_instance->mobmenu_core->frontend_enqueue_scripts();

		echo '<div class="elementor-mobile-left-menu-wrapper">';
		
		// Show button if enabled
		if ( 'yes' === $settings['show_button'] ) {
			echo $mobile_menu_instance->mobmenu_core->load_mobile_menu_html( 
				$menu_type, 
				esc_attr( $menu_text ), 
				esc_attr( $icon_action ), 
				esc_attr( $icon_target ), 
				esc_attr( $icon_url ), 
				$icon_font, 
				$icon, 
				$icon_new, 
				$animation, 
				$close_icon 
			);
		}
		
		// Add the menu panel HTML (this is normally added to wp_footer, but we need it here for Elementor)
		$this->render_menu_panel( $settings, $plugin_settings );
		
		echo '</div>';
	}

	/**
	 * Render the menu panel HTML.
	 *
	 * @param array $settings Widget settings
	 * @param object $plugin_settings Plugin settings
	 */
	private function render_menu_panel( $settings, $plugin_settings ) {
		// Get the selected menu or use global setting
		$menu_id = ! empty( $settings['menu_select'] ) ? $settings['menu_select'] : $plugin_settings->getOption( 'left_menu' );
		
		if ( empty( $menu_id ) ) {
			return;
		}

		$menu_class = 'elementor-widget-menu-' . $this->get_id();
		
		echo '<div class="mobmenu-panel mobmenu-left-panel show-panel ' . esc_attr( $menu_class ) . '" data-panel-target="mobmenu-left-panel">';
		echo '<div class="mobmenu-content">';
		
		// Close button
		echo '<a href="#" class="mob-cancel-button">';
		echo '<i class="mobmenu-font mob-cancel-button mob-icon-cancel"></i>';
		echo '</a>';
		
		// Menu content
		echo wp_nav_menu( array(
			'menu'           => $menu_id,
			'theme_location' => '',
			'container'      => false,
			'menu_class'     => 'mobmenu-left-menu',
			'menu_id'        => 'mobmenuleft-' . $this->get_id(),
			'echo'           => false,
			'fallback_cb'    => false,
			'walker'         => new \WP_Mobile_Menu_Walker_Nav_Menu('', ''),
		) );
		
		echo '</div>';
		echo '</div>';
	}

	/**
	 * Add custom CSS for this widget instance.
	 *
	 * @param array $settings Widget settings
	 */
	private function add_widget_custom_css( $settings ) {
		$widget_id = $this->get_id();
		$css = '';

		// Panel background color
		if ( ! empty( $settings['panel_background'] ) ) {
			$css .= ".elementor-widget-menu-{$widget_id} { background-color: {$settings['panel_background']} !important; }";
		}

		// Panel text color
		if ( ! empty( $settings['panel_text_color'] ) ) {
			$css .= ".elementor-widget-menu-{$widget_id} a { color: {$settings['panel_text_color']} !important; }";
		}

		// Panel width
		if ( ! empty( $settings['panel_width']['size'] ) ) {
			$unit = ! empty( $settings['panel_width']['unit'] ) ? $settings['panel_width']['unit'] : '%';
			$css .= ".elementor-widget-menu-{$widget_id} { width: {$settings['panel_width']['size']}{$unit} !important; }";
		}

		if ( ! empty( $css ) ) {
			echo '<style>' . $css . '</style>';
		}
	}

	/**
	 * Render widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	protected function content_template() {
		?>
		<div class="elementor-mobile-left-menu-wrapper">
			<# if ( settings.show_button === 'yes' ) { #>
				<div class="elementor-mobile-menu-preview">
					<a href="#" class="mobmenu-left-bt">
						<i class="mobmenu-font mob-icon-menu"></i>
						<# if ( settings.button_text ) { #>
							<span class="left-menu-icon-text">{{{ settings.button_text }}}</span>
						<# } #>
					</a>
				</div>
			<# } #>
			<div class="elementor-mobile-menu-note">
				<p><?php _e( 'Mobile Left Menu will be displayed on the frontend. The menu panel will appear when the button is clicked.', 'mobile-menu' ); ?></p>
			</div>
		</div>
		<?php
	}
}